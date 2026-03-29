const API_KEY = import.meta.env.VITE_IMGBB_API_KEY ?? ''

interface ImgbbResponse {
  data: { url: string }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Failed to read file as string'))
      }
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export async function uploadToImgbb(file: File): Promise<string> {
  if (!API_KEY) throw new Error('VITE_IMGBB_API_KEY is not set')

  const dataUrl = await fileToBase64(file)
  const base64 = dataUrl.split(',')[1]

  const form = new FormData()
  form.append('key', API_KEY)
  form.append('image', base64)

  const res = await fetch('https://api.imgbb.com/1/upload', {
    method: 'POST',
    body: form,
  })

  if (!res.ok) throw new Error('Image upload failed')

  const json: ImgbbResponse = await res.json()
  return json.data.url
}
