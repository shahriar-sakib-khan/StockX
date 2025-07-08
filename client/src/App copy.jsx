const App = () => {
  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
      <div className='p-6 rounded-2xl border border-dashed border-gray-300 shadow-md max-w-sm text-center'>
        <p className='text-gray-500 mb-4 text-sm'>
          If this box looks sleek, Tailwind is working.
        </p>
        <button className='px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg hover:scale-105 hover:shadow transition-all'>
          Confirmed ✨
        </button>
      </div>
    </div>
  );
};
export default App;
