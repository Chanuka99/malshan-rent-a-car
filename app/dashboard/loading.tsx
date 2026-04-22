export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-3" />
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl h-32 animate-pulse border border-gray-100" />
        ))}
      </div>
    </div>
  )
}
