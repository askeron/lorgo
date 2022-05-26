import { useTeacherStore } from '@/stores/teacher'

async function jsonPost(path, body) {
  const response = await fetch(`http://localhost:8080${path}`, {
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

export async function useCreateRoom(name) {
  const { id, secret } = await jsonPost('/api/v1/owner/createNewRoom', {
    name,
  })
  const teacherStore = useTeacherStore()
  teacherStore.addRoom({
    id,
    secret,
    name,
  })
}

export async function useDeleteRoom(id) {
  await jsonPost('/api/v1/owner/deleteRoom', {
    id,
    secret,
  })
  teacherStore.deleteRoom(id)
}

export async function useRenameRoom({id, name}) {
  const teacherStore = useTeacherStore()
  const { secret } = teacherStore.getRoomById(id)
  await jsonPost('/api/v1/owner/updateRoom', {
    id,
    secret,
    name,
  })
  teacherStore.renameRoom(id, name)
}

export async function useOpenRoom(id) {
  const teacherStore = useTeacherStore()
  const { secret, name } = teacherStore.getRoomById(id)
  await jsonPost('/api/v1/owner/updateRoom', {
    id,
    secret,
    name,
    currentlyOpen: true,
  })
  teacherStore.openRoom(id)
}

export async function useCloseRoom(id) {
  const teacherStore = useTeacherStore()
  const { secret, name } = teacherStore.getRoomById(id)
  await jsonPost('/api/v1/owner/updateRoom', {
    id,
    secret,
    name,
    currentlyOpen: false,
  })
  teacherStore.closeRoom(id)
}