import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'
import type { Profile } from '@/types/supabase'

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2 MB

// Service-role client bypasses RLS — only used AFTER admin auth is verified
function getAdminStorageClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createServiceClient(url, serviceKey, {
    auth: { persistSession: false },
  })
}

async function verifyAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  const profile = data as Profile | null
  return profile?.role === 'admin' ? user : null
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAdmin()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = formData.get('folder') as string | null

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file size (2 MB max)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 2 MB.' },
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

    // Build file path
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
    const filePath = folder ? `${folder}/${fileName}` : fileName

    // Convert to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Use service-role client to bypass storage RLS
    const adminSupabase = getAdminStorageClient()
    const { error: uploadError } = await adminSupabase.storage
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
            ? 'Storage bucket "cars" not found. Please create it in Supabase dashboard.'
            : uploadError.message,
        },
        { status: 500 }
      )
    }

    const { data: urlData } = adminSupabase.storage.from('cars').getPublicUrl(filePath)
    return NextResponse.json({ url: urlData.publicUrl })
  } catch (err) {
    console.error('Upload route error:', err)
    return NextResponse.json(
      { error: 'Upload failed. Please try again.' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyAdmin()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { url } = await request.json()
    if (!url) {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 })
    }

    // Extract file path from public URL
    const parts = url.split('/public/cars/')
    if (parts.length !== 2) {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
    }
    const filePath = parts[1]

    // Use service-role client to bypass storage RLS
    const adminSupabase = getAdminStorageClient()
    const { error: deleteError } = await adminSupabase.storage
      .from('cars')
      .remove([filePath])

    if (deleteError) {
      console.error('Supabase delete error:', deleteError)
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Delete route error:', err)
    return NextResponse.json(
      { error: 'Delete failed. Please try again.' },
      { status: 500 }
    )
  }
}
