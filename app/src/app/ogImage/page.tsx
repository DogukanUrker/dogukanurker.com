export default function OGImage() {
    return (
        <div className="h-[630px] w-[1200px] bg-black flex">
            <img
                src="/me.webp"
                alt="Profile"
                className="h-full w-[500px] object-cover grayscale"
            />
            <div className="flex-1 flex items-center p-16">
                <div className="space-y-4">
                    <h1 className="text-6xl font-bold text-white">Doğukan Ürker</h1>
                    <p className="text-3xl text-gray-400">Full Stack Developer</p>
                </div>
            </div>
        </div>
    )
}

