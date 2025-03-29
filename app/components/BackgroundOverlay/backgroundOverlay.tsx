export default function BackgroundOverlay() {
    return (
        <div className="absolute inset-0 -z-10 bg-black">
            {/* Wyrazisty główny gradient z intensywną czerwienią - znacznie wyższe opacity */}
            <div
                className="absolute inset-0 opacity-50"
                style={{
                    background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%, rgba(180, 0, 0, 0.5) 30%, rgba(150, 0, 0, 0.5) 70%, rgba(50, 0, 0, 0.9) 100%)'
                }}
            />
            
            {/* Mocny czerwony akcent w centrum */}
            <div
                className="absolute inset-0 opacity-50"
                style={{
                    background: 'radial-gradient(circle at 50% 40%, rgba(220, 0, 0, 0.3) 0%, rgba(160, 0, 0, 0.35) 30%, rgba(100, 0, 0, 0.2) 60%, transparent 80%)'
                }}
            />
            
            
            {/* Ciemniejsze krawędzie dla głębi, ale z mniejszym opacity by nie tłumić czerwieni */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-90" />

            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black opacity-50" />

            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50" />
            
            
            {/* Subtelna tekstura dla dodania głębi i charakteru */}
            <div 
                className="absolute inset-0 opacity-50"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23ff0000' fill-opacity='0.5' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundSize: '8px 8px',
                    mixBlendMode: 'overlay'
                }}
            />
        </div>
    );
};