import { usePupilStore } from '@/stores/pupil'
import { notify } from "@kyvg/vue3-notification";

async function jsonPost(path, body) {
  const response = await fetch(`http://localhost:8080/${path.substring(1)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', 
    },
    body: JSON.stringify(body),
  })
  if (!response.ok) {
    throw new Error(`api call for ${path} failed`)
  }
  return await response.json()
}

export async function useCheckPendingInvites() {
  const pupilStore = usePupilStore()
  const pendingInvites = pupilStore.pendingInvites
  if (pendingInvites.length > 0) {
    const results = await jsonPost('/api/v1/pupil/getStatusOfPendingInvites', {
      pendingInvites: pendingInvites.map(x => {
        const { roomId, roomDeviceId, roomDeviceSecret } = x
        return {
          roomId,
          roomDeviceId,
          roomDeviceSecret,
        }
      })
    }
  )
  results.forEach(result => {
    const { roomDeviceId, status } = result
    const { roomId, roomDeviceSecret, roomName } = pupilStore.getPendingInvitesByRoomDeviceId(roomDeviceId) || {}
    if (roomDeviceSecret) {
      if (status === "pending") {
        // nothing to do
      } else if (status === "accepted") {
        notify({
          title: "Raumbeitritt",
          text: `Beitritt zum Raum "${roomName}" war erfolgreich.`,
        })
        pupilStore.addRoom({
          roomId,
          roomDeviceId,
          roomDeviceSecret,
          roomName,
        })
      } else {
        notify({
          title: "Raumbeitritt",
          text: `Beitritt zum Raum "${roomName}" war nicht erfolgreich.`,
          type: "warn",
        })
        pupilStore.removePendingInvite(roomDeviceId)
      }
    }
  })
  }
}

export async function useUseInviteCode(inviteCode, suggestedPupilName) {
  const {
    found,
    roomId,
    roomName,
    roomDeviceId,
    roomDeviceSecret,
    lifetimeMillis,
  } = await jsonPost('/api/v1/pupil/useInviteCode', {
    inviteCode,
    suggestedPupilName,
  })
  if (!found) {
    notify({
      title: "Raumbeitritt",
      text: `Einladungscode ist nicht gültig.`,
      type: "warn",
    })
    return
  }
  const pupilStore = usePupilStore()
  pupilStore.addPendingInvite({
    roomId,
    roomName,
    roomDeviceId,
    roomDeviceSecret,
    validUntil: Date.now() + lifetimeMillis,
  })
  notify({
    title: "Raumbeitritt",
    text: `Beitritt zum Raum "${roomName}" läuft.`,
  })
}
