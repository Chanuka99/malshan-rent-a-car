import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'
import type { Profile } from '@/types/supabase'

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2 MB

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Auth check
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Admin check
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    const profile = data as Profile | null
    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = formData.get('folder') as string | null

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file size (2 MB max)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size is 2 MB.` },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Only JPG, PNG, and WebP images are allowed.' },
        { status: 400 }
      )
    }

    // Upload to Supabase Storage
    const fileExt = file.name.split('.').pop()
    const randomString = Math.random().toString(36).slice(2)
    const fileName = `${Date.now()}-${randomString}.${fileExt}`
    
    // Construct the path (folder/filename)
    const filePath = folder ? `${folder}/${fileName}` : fileName

    // Convert File to ArrayBuffer for reliable upload
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error: uploadError } = await supabase.storage
      .from('cars')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Supabase upload error:', uploadError)
      const isBucketError = uploadError.message?.toLowerCase().includes('bucket not found')
      return NextResponse.json(
        { 
          error: isBucketError 
            ? 'Storage bucket "cars" not found. Please create it in your Supabase dashboard and set it to public.' 
            : uploadError.message 
        },
        { status: 500 }
      )
    }

    const { data: urlData } = supabase.storage
      .from('cars')
      .getPublicUrl(filePath)

    return NextResponse.json({ url: urlData.publicUrl })
  } catch (err) {
    console.error('Upload route error:', err)
    return NextResponse.json(
      { error: 'Upload failed. Please try again.' },
      { status: 500 }
    )
  }
}
