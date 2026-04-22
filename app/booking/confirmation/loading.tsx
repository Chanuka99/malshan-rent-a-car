export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
      <div className="max-w-lg w-full">
        <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse mx-auto mb-6" />
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mx-auto mb-4" />
        <div className="bg-white rounded-2xl border border-gray-200 h-80 animate-pulse" />
      </div>
    </div>
  )
}
