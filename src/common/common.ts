

export const createBlobByBuffer = (data: Buffer) => {
  if (!data) return undefined
  const blob = new Blob([data], { type: 'audio/mp4' })
  if (blob.size === 0) return undefined
  return blob
}

