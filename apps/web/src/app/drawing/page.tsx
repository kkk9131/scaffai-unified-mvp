                <g>
                  <line
                    x1={dragStart.x}
                    y1={dragStart.y}
                    x2={mousePos.x}
                    y2={mousePos.y}
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeDasharray="8,4"
                  />
                  {/* 描画中の寸法 */}
                  <text
                    x={(dragStart.x + mousePos.x) / 2}
                    y={(dragStart.y + mousePos.y) / 2 - 12}
                    fontSize="11"
                    textAnchor="middle"
                    fill="#3b82f6"
                    className="pointer-events-none font-medium"
                  >
                    {Math.round(Math.sqrt(
                      Math.pow(mousePos.x - dragStart.x, 2) + 
                      Math.pow(mousePos.y - dragStart.y, 2)
                    ) * pixelToMm).toLocaleString()}mm
                  </text>
                </g>
              )}

              {/* スナップポイント表示 */}
              {snapToGrid && !nearestEndpoint && (
                <circle
                  cx={mousePos.x}
                  cy={mousePos.y}
                  r="3"
                  fill="#f59e0b"
                  className="pointer-events-none"
                />
              )}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}