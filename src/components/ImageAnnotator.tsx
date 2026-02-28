import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Circle, Square, Pencil, Undo2, Trash2, ZoomIn, ZoomOut, Move, MousePointer } from 'lucide-react';

export default function ImageAnnotator({ imageUrl, onSave, onCancel }) {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [tool, setTool] = useState('circle');
    const [color, setColor] = useState('#ef4444');
    const [brushSize, setBrushSize] = useState(4);
    const [isDrawing, setIsDrawing] = useState(false);
    const [annotations, setAnnotations] = useState([]);
    const [currentPath, setCurrentPath] = useState([]);
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

    const colors = [
        { name: 'Red', value: '#ef4444' },
        { name: 'Orange', value: '#f97316' },
        { name: 'Yellow', value: '#eab308' },
        { name: 'Green', value: '#22c55e' },
        { name: 'Blue', value: '#3b82f6' },
    ];

    const tools = [
        { id: 'circle', icon: Circle, label: 'Circle' },
        { id: 'rectangle', icon: Square, label: 'Rectangle' },
        { id: 'freehand', icon: Pencil, label: 'Draw' },
        { id: 'pan', icon: Move, label: 'Pan' },
    ];

    useEffect(() => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const canvas = canvasRef.current;
            const container = containerRef.current;
            if (!canvas || !container) return;

            const maxWidth = container.clientWidth - 40;
            const maxHeight = 500;
            
            let width = img.width;
            let height = img.height;
            
            if (width > maxWidth) {
                height = (maxWidth / width) * height;
                width = maxWidth;
            }
            if (height > maxHeight) {
                width = (maxHeight / height) * width;
                height = maxHeight;
            }

            canvas.width = width;
            canvas.height = height;
            setImageDimensions({ width, height, originalWidth: img.width, originalHeight: img.height });
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            setImageLoaded(true);
        };
        img.src = imageUrl;
    }, [imageUrl]);

    const redrawCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas || !imageLoaded) return;
        
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(pan.x, pan.y);
            ctx.scale(zoom, zoom);
            ctx.drawImage(img, 0, 0, imageDimensions.width / zoom, imageDimensions.height / zoom);
            
            annotations.forEach(annotation => {
                drawAnnotation(ctx, annotation);
            });
            
            if (currentPath.length > 0) {
                drawAnnotation(ctx, { type: 'freehand', points: currentPath, color, brushSize });
            }
            
            ctx.restore();
        };
        img.src = imageUrl;
    };

    useEffect(() => {
        redrawCanvas();
    }, [annotations, currentPath, zoom, pan, imageLoaded]);

    const drawAnnotation = (ctx, annotation) => {
        ctx.strokeStyle = annotation.color;
        ctx.lineWidth = annotation.brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (annotation.type === 'circle') {
            ctx.beginPath();
            const radius = Math.sqrt(
                Math.pow(annotation.endX - annotation.startX, 2) + 
                Math.pow(annotation.endY - annotation.startY, 2)
            );
            ctx.arc(annotation.startX, annotation.startY, radius, 0, 2 * Math.PI);
            ctx.stroke();
        } else if (annotation.type === 'rectangle') {
            ctx.strokeRect(
                annotation.startX, 
                annotation.startY, 
                annotation.endX - annotation.startX, 
                annotation.endY - annotation.startY
            );
        } else if (annotation.type === 'freehand' && annotation.points.length > 1) {
            ctx.beginPath();
            ctx.moveTo(annotation.points[0].x, annotation.points[0].y);
            for (let i = 1; i < annotation.points.length; i++) {
                ctx.lineTo(annotation.points[i].x, annotation.points[i].y);
            }
            ctx.stroke();
        }
    };

    const getCanvasPoint = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left - pan.x) / zoom,
            y: (e.clientY - rect.top - pan.y) / zoom
        };
    };

    const handleMouseDown = (e) => {
        const point = getCanvasPoint(e);
        
        if (tool === 'pan') {
            setIsPanning(true);
            setLastPanPoint({ x: e.clientX, y: e.clientY });
            return;
        }

        setIsDrawing(true);
        if (tool === 'freehand') {
            setCurrentPath([point]);
        } else {
            setCurrentPath([{ startX: point.x, startY: point.y }]);
        }
    };

    const handleMouseMove = (e) => {
        if (isPanning) {
            setPan({
                x: pan.x + (e.clientX - lastPanPoint.x),
                y: pan.y + (e.clientY - lastPanPoint.y)
            });
            setLastPanPoint({ x: e.clientX, y: e.clientY });
            return;
        }

        if (!isDrawing) return;
        
        const point = getCanvasPoint(e);
        
        if (tool === 'freehand') {
            setCurrentPath(prev => [...prev, point]);
        } else {
            setCurrentPath(prev => [{
                ...prev[0],
                endX: point.x,
                endY: point.y
            }]);
        }
    };

    const handleMouseUp = () => {
        if (isPanning) {
            setIsPanning(false);
            return;
        }

        if (!isDrawing) return;
        setIsDrawing(false);

        if (tool === 'freehand' && currentPath.length > 1) {
            setAnnotations(prev => [...prev, { type: 'freehand', points: currentPath, color, brushSize }]);
        } else if (currentPath[0]?.endX !== undefined) {
            setAnnotations(prev => [...prev, {
                type: tool,
                startX: currentPath[0].startX,
                startY: currentPath[0].startY,
                endX: currentPath[0].endX,
                endY: currentPath[0].endY,
                color,
                brushSize
            }]);
        }
        setCurrentPath([]);
    };

    const handleUndo = () => {
        setAnnotations(prev => prev.slice(0, -1));
    };

    const handleClear = () => {
        setAnnotations([]);
    };

    const handleZoom = (delta) => {
        setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
    };

    const handleSave = () => {
        const canvas = canvasRef.current;
        canvas.toBlob((blob) => {
            const file = new File([blob], 'annotated-crop.png', { type: 'image/png' });
            onSave(file, canvas.toDataURL('image/png'));
        }, 'image/png');
    };

    return (
        <div ref={containerRef} className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Toolbar */}
            <div className="bg-gray-50 border-b border-gray-200 p-3 md:p-4">
                <div className="flex flex-wrap items-center gap-2 md:gap-4">
                    {/* Tools */}
                    <div className="flex items-center gap-1 bg-white rounded-xl p-1 shadow-sm">
                        {tools.map(t => (
                            <Button
                                key={t.id}
                                variant={tool === t.id ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setTool(t.id)}
                                className={`rounded-lg ${tool === t.id ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
                            >
                                <t.icon className="w-4 h-4" />
                            </Button>
                        ))}
                    </div>

                    {/* Colors */}
                    <div className="flex items-center gap-2">
                        {colors.map(c => (
                            <button
                                key={c.value}
                                onClick={() => setColor(c.value)}
                                className={`w-7 h-7 rounded-full transition-transform ${color === c.value ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''}`}
                                style={{ backgroundColor: c.value }}
                            />
                        ))}
                    </div>

                    {/* Brush Size */}
                    <div className="hidden sm:flex items-center gap-2 min-w-[120px]">
                        <span className="text-xs text-gray-500">Size</span>
                        <Slider
                            value={[brushSize]}
                            onValueChange={([val]) => setBrushSize(val)}
                            min={1}
                            max={12}
                            step={1}
                            className="flex-1"
                        />
                    </div>

                    {/* Zoom */}
                    <div className="flex items-center gap-1 bg-white rounded-xl p-1 shadow-sm">
                        <Button variant="ghost" size="sm" onClick={() => handleZoom(-0.25)} className="rounded-lg">
                            <ZoomOut className="w-4 h-4" />
                        </Button>
                        <span className="text-xs font-medium w-12 text-center">{Math.round(zoom * 100)}%</span>
                        <Button variant="ghost" size="sm" onClick={() => handleZoom(0.25)} className="rounded-lg">
                            <ZoomIn className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 ml-auto">
                        <Button variant="ghost" size="sm" onClick={handleUndo} disabled={annotations.length === 0} className="rounded-lg">
                            <Undo2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleClear} disabled={annotations.length === 0} className="rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Canvas */}
            <div className="p-4 bg-gray-100 overflow-auto" style={{ maxHeight: '550px' }}>
                <canvas
                    ref={canvasRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    className="mx-auto rounded-lg shadow-lg cursor-crosshair"
                    style={{ cursor: tool === 'pan' ? 'grab' : 'crosshair' }}
                />
            </div>

            {/* Footer */}
            <div className="bg-gray-50 border-t border-gray-200 p-4 flex justify-between items-center">
                <p className="text-sm text-gray-500">
                    Mark areas of concern for better diagnosis
                </p>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={onCancel} className="rounded-xl">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} className="rounded-xl bg-emerald-600 hover:bg-emerald-700">
                        Save & Analyze
                    </Button>
                </div>
            </div>
        </div>
    );
}

