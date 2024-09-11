export default function Canvas({
  canvasRef,
  noiseCanvasRef,
  canvasSize,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp
}) {
  return (
    <div className="relative" style={{ width: `${canvasSize.width}px`, height: `${canvasSize.height}px` }}>
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="rounded-lg shadow-lg"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      ></canvas>
      <canvas
        ref={noiseCanvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="absolute top-0 left-0 rounded-lg pointer-events-none"
        style={{ mixBlendMode: 'overlay' }}
      ></canvas>
    </div>
  );
}