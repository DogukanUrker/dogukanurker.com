export default function OGImage() {
    return (
        <div className="relative h-[630px] w-[1200px] bg-black overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url('/shooting-star-bg-desktop.png')`,
                }}
            />
            
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
            
            <div className="absolute bottom-16 right-16 text-right">
                <h1 
                    className="text-white text-7xl font-light mb-4 tracking-wide"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    Dogukan Urker
                </h1>
                <p className="text-gray-300 text-2xl opacity-80">
                    software engineer @sensity.ai
                </p>
            </div>
        </div>
    )
}

