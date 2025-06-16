function Sign_up(){
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-80 space-y-2">
        <label htmlFor="username" className="text-sm font-medium text-gray-700">Username</label>
        <input
          type="text"
          id="username"
          placeholder="Username"
          className="w-full px-4 py-2 mt-0 border rounded"
        />
        <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          placeholder="abc@xyz.com"
          id="email"
          className="w-full px-4 py-2 border rounded"
        />
        <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="password"
          placeholder="Re type Password"
          className="w-full px-4 py-2 border rounded"
        />
        <button
          id="login_button"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Sign Up
        </button>
      </div>
    </div>
  )
}

export default Sign_up;