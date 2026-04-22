export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-80 h-80 bg-gray-200 rounded-2xl animate-pulse" />
          <div className="flex-1 h-96 bg-gray-200 rounded-2xl animate-pulse" />
        </div>
      </div>
    </div>
  )
}
