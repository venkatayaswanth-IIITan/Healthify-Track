import React, { useState, useEffect, useRef } from 'react';
import { Camera, Check, X, Utensils } from 'lucide-react';

const FoodScanner = () => {
    const [scanning, setScanning] = useState(false);
    const [scanResult, setScanResult] = useState<{ success: boolean, message: string, calories?: number, protein?: number } | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);

    useEffect(() => {
        if (scanning) {
            startCamera();
        } else {
            stopCamera();
        }

        return () => {
            stopCamera();
        };
    }, [scanning]);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setCameraPermission(true);
            }
        } catch (err) {
            console.error('Error accessing camera:', err);
            setCameraPermission(false);
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            const tracks = stream.getTracks();

            tracks.forEach(track => {
                track.stop();
            });

            videoRef.current.srcObject = null;
        }
    };

    const scanFood = () => {
        if (!canvasRef.current || !videoRef.current) return;

        const canvas = canvasRef.current;
        const video = videoRef.current;
        const context = canvas.getContext('2d');

        if (context && video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.height = video.videoHeight;
            canvas.width = video.videoWidth;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Mock food detection and analysis - replace with real ML model integration
            const mockFood = detectFood();
            const { calories, protein } = analyzeFood(mockFood);

            setScanResult({
                success: true,
                message: `Analyzed: ${mockFood}`,
                calories,
                protein
            });
            setScanning(false);
        } else {
            setTimeout(scanFood, 100);
        }
    };

    // Mock food detection (replace with actual ML model)
    const detectFood = () => {
        const foods = ['Apple', 'Banana', 'Chicken Breast', 'Salad', 'Pizza'];
        return foods[Math.floor(Math.random() * foods.length)];
    };

    // Mock food analysis (replace with actual nutrition API or ML model)
    const analyzeFood = (food: string) => {
        const foodData = {
            'Apple': { calories: 95, protein: 0.5 },
            'Banana': { calories: 105, protein: 1.3 },
            'Chicken Breast': { calories: 165, protein: 31 },
            'Salad': { calories: 150, protein: 10 },
            'Pizza': { calories: 300, protein: 15 }
        };

        return foodData[food] || { calories: 0, protein: 0 };
    };

    const handleScanClick = () => {
        setScanning(true);
        setScanResult(null);

        setTimeout(() => {
            scanFood();
        }, 1000);
    };

    return (
        <div className="space-y-6 pb-20">
            <h1 className="text-2xl font-bold text-gray-800">Food Scanner</h1>

            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-3">
                        <Utensils className="h-8 w-8 text-green-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">Scan Your Food</h2>
                    <p className="text-gray-600 mt-1">
                        Scan your food to get calorie and protein information.
                    </p>
                </div>

                {!scanning && !scanResult && (
                    <button
                        onClick={handleScanClick}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center"
                    >
                        <Camera className="h-5 w-5 mr-2" />
                        Start Scanning
                    </button>
                )}

                {scanning && (
                    <div className="relative">
                        <div className="aspect-square max-w-sm mx-auto overflow-hidden rounded-lg relative">
                            <video
                                ref={videoRef}
                                className="w-full h-full object-cover"
                                autoPlay
                                playsInline
                                muted
                            ></video>

                            <div className="absolute inset-0 border-2 border-green-500 border-dashed opacity-70 pointer-events-none"></div>

                            <canvas
                                ref={canvasRef}
                                className="hidden"
                            ></canvas>
                        </div>

                        <p className="text-center text-sm text-gray-600 mt-3">
                            Position the food within the frame
                        </p>

                        <button
                            onClick={() => setScanning(false)}
                            className="mt-4 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg"
                        >
                            Cancel
                        </button>
                    </div>
                )}

                {scanResult && (
                    <div className={`p-4 rounded-lg ${scanResult.success ? 'bg-green-100' : 'bg-red-100'} mt-4`}>
                        <div className="flex items-start">
                            <div className={`p-2 rounded-full ${scanResult.success ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'} mr-3`}>
                                {scanResult.success ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                            </div>
                            <div>
                                <h3 className={`font-medium ${scanResult.success ? 'text-green-800' : 'text-red-800'}`}>
                                    {scanResult.message}
                                </h3>
                                {scanResult.success && (
                                    <>
                                        <p className="text-green-700 font-medium mt-1">
                                            Calories: {scanResult.calories}
                                        </p>
                                        <p className="text-green-700 font-medium mt-1">
                                            Protein: {scanResult.protein}g
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="mt-4 flex space-x-3">
                            <button
                                onClick={handleScanClick}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center"
                            >
                                <Camera className="h-4 w-4 mr-1" />
                                Scan Again
                            </button>
                        </div>
                    </div>
                )}

                {cameraPermission === false && (
                    <div className="p-4 bg-yellow-100 rounded-lg mt-4">
                        <p className="text-yellow-800">
                            Camera access is required to scan food items. Please allow camera access in your browser settings.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FoodScanner;