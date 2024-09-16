export default function Canvas({
  canvasRef,
  noiseCanvasRef,
  canvasSize,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp
}) {
  return (
    <div className="relative w-full h-full" style={{ aspectRatio: '9 / 19.5' }}>
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg object-contain"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      ></canvas>
      <canvas
        ref={noiseCanvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="absolute top-0 left-0 w-full h-full rounded-lg pointer-events-none object-contain"
        style={{ mixBlendMode: 'overlay' }}
      ></canvas>
    </div>
  );
}