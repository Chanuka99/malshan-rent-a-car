export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-3" />
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <div className="w-72 bg-white rounded-xl h-96 animate-pulse border border-gray-100" />
          <div className="flex-1 grid grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-72 animate-pulse border border-gray-100" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
