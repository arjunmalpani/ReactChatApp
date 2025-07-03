function HomePage() {
return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200">
        <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Welcome to ReactChatApp!</h1>
            <p className="py-2 text-lg text-base-content/70 mb-6">
                Connect and chat with your friends instantly.
            </p>
            <div className="flex gap-4 justify-center">
                <a href="/chat" className="btn btn-primary">Go to Chat</a>
                <a href="/chat" className="btn btn-outline btn-secondary">Try Now</a>
            </div>
        </div>
    </div>
)
}
export default HomePage