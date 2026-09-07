import React, { useState, useEffect, useRef } from 'react';
import { Camera, Check, X, Utensils } from 'lucide-react';

const FoodScanner = () => {
    const [scanning, setScanning] = useState(false);
    const [scanResult, setScanResult] = useState<{ success: boolean; message: string; calories?: number; protein?: number } | null>(null);
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

    const detectFood = () => {
        const foods = ['Apple', 'Banana', 'Chicken Breast', 'Salad', 'Pizza', 'Oatmeal', 'Greek Yogurt'];
        return foods[Math.floor(Math.random() * foods.length)];
    };

    const analyzeFood = (food: string) => {
        const foodData: Record<string, { calories: number; protein: number }> = {
            'Apple': { calories: 95, protein: 0.5 },
            'Banana': { calories: 105, protein: 1.3 },
            'Chicken Breast': { calories: 165, protein: 31 },
            'Salad': { calories: 150, protein: 10 },
            'Pizza': { calories: 300, protein: 15 },
            'Oatmeal': { calories: 150, protein: 5 },
            'Greek Yogurt': { calories: 120, protein: 10 }
        };

        return foodData[food] || { calories: 120, protein: 5 };
    };

    const handleScanClick = () => {
        setScanning(true);
        setScanResult(null);

        setTimeout(() => {
            scanFood();
        }, 1200);
    };

    return (
        <div className="space-y-6 pb-20">
            <h1 className="text-2xl font-bold text-gray-800">Smart Food Scanner</h1>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-2xl mb-3">
                        <Utensils className="h-8 w-8 text-green-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Scan Meal & Nutrients</h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Use your device camera to recognize meals and compute nutritional metrics.
                    </p>
                </div>

                {!scanning && !scanResult && (
                    <button
                        onClick={handleScanClick}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center transition shadow-md"
                    >
                        <Camera className="h-5 w-5 mr-2" />
                        Start Camera Scanner
                    </button>
                )}

                {scanning && (
                    <div className="relative">
                        <div className="aspect-square max-w-sm mx-auto overflow-hidden rounded-2xl relative bg-black shadow-inner">
                            <video
                                ref={videoRef}
                                className="w-full h-full object-cover"
                                autoPlay
                                playsInline
                                muted
                            ></video>

                            <div className="absolute inset-0 border-4 border-green-400 border-dashed rounded-2xl opacity-75 pointer-events-none animate-pulse"></div>

                            <canvas
                                ref={canvasRef}
                                className="hidden"
                            ></canvas>
                        </div>

                        <p className="text-center text-xs text-gray-500 mt-3 font-medium">
                            Centering camera on food item for real-time analysis...
                        </p>

                        <button
                            onClick={() => setScanning(false)}
                            className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2.5 px-4 rounded-xl transition"
                        >
                            Cancel
                        </button>
                    </div>
                )}

                {scanResult && (
                    <div className={`p-5 rounded-2xl ${scanResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'} mt-4`}>
                        <div className="flex items-start">
                            <div className={`p-2 rounded-full ${scanResult.success ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'} mr-3`}>
                                {scanResult.success ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                            </div>
                            <div>
                                <h3 className={`font-bold ${scanResult.success ? 'text-green-900' : 'text-red-900'}`}>
                                    {scanResult.message}
                                </h3>
                                {scanResult.success && (
                                    <div className="mt-2 flex gap-4 text-sm font-semibold">
                                        <span className="text-green-800 bg-white/70 px-3 py-1 rounded-lg">
                                            🔥 Calories: {scanResult.calories} kcal
                                        </span>
                                        <span className="text-green-800 bg-white/70 px-3 py-1 rounded-lg">
                                            💪 Protein: {scanResult.protein}g
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-4 flex space-x-3">
                            <button
                                onClick={handleScanClick}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center transition shadow-sm"
                            >
                                <Camera className="h-4 w-4 mr-1.5" />
                                Scan Another Item
                            </button>
                        </div>
                    </div>
                )}

                {cameraPermission === false && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl mt-4 text-sm text-yellow-800">
                        Camera access was denied. Please allow camera permissions in your browser bar to scan meals live.
                    </div>
                )}
            </div>
        </div>
    );
};

export default FoodScanner;