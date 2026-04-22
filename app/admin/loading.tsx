export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-3" />
          <div className="h-8 w-56 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl h-24 animate-pulse border border-gray-100" />
          ))}
        </div>
        <div className="bg-white rounded-xl h-96 animate-pulse border border-gray-100" />
      </div>
    </div>
  )
}
