function Post() {
  const data = [
        {
            id: 1,
            title: "Introduction to React",
            description: "A beginner's guide to building user interfaces with React.",
            time: "2025-06-21T10:30:00Z",
            link: "https://example.com/react-intro",
            username: "alice_dev"
        },
        {
            id: 2,
            title: "Understanding JavaScript Closures",
            description: "Learn how closures work in JavaScript with simple examples.",
            time: "2025-06-20T09:00:00Z",
            link: "https://example.com/js-closures",
            username: "bob_codes"
        },
        {
            id: 3,
            title: "CSS Grid vs Flexbox",
            description: "Comparison of CSS layout techniques and when to use each.",
            time: "2025-06-19T14:15:00Z",
            link: "https://example.com/css-layouts",
            username: "charlie_ui"
        },
        {
            id: 4,
            title: "REST API Design Best Practices",
            description: "Explore the best practices for designing scalable RESTful APIs.",
            time: "2025-06-18T16:00:00Z",
            link: "https://example.com/rest-api",
            username: "api_guru"
        },
        {
            id: 5,
            title: "Async/Await in JavaScript",
            description: "A practical guide to asynchronous programming using async/await.",
            time: "2025-06-17T11:45:00Z",
            link: "https://example.com/async-await",
            username: "js_ninja"
        }
    ];

    function open_profile(){

    }

  return (
    <div id="user_posts" className="max-w-4xl mx-auto py-10 px-5">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Recent Posts</h2>
        <ul className="space-y-6">
    {data.map((post) => (
        <li
        key={post.id}
        className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition duration-300"
        >
        <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500 cursor-pointer" onClick={()=>open_profile()}>@{post.username}</span>
            <span className="text-sm text-gray-400">
            {new Date(post.time).toLocaleString()}
            </span>
        </div>
        <h3 className="text-xl font-semibold text-blue-600 hover:underline">
            <a href={post.link} target="_blank" rel="noopener noreferrer">
            {post.title}
            </a>
        </h3>
        <p className="text-gray-600 mt-2">{post.description}</p>
        </li>
    ))}
    </ul>

        </div>
  );
}

export default Post;