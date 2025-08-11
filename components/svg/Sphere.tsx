import * as React from 'react';

export default function Sphere(props: { size?: number; segments?: number; style?: React.CSSProperties }) {
  const size = props.size || 500;
  const segments = props.segments || 6;
  const radius = size * 0.4;

  const generateSpherePoints = () => {
    const points: { x: number; y: number }[][] = [];
    for (let lat = 0; lat <= segments; lat++) {
      const row: { x: number; y: number }[] = [];
      const phi = (lat * Math.PI) / segments;
      for (let lon = 0; lon <= segments; lon++) {
        const theta = (lon * 2 * Math.PI) / segments;
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);
        const scale = 1 + z / (radius * 4);
        row.push({
          x: size / 2 + x * scale,
          y: size / 2 + y * scale,
        });
      }
      points.push(row);
    }
    return points;
  };

  const createPaths = () => {
    const spherePoints = generateSpherePoints();
    const paths: string[] = [];
    for (let lat = 0; lat <= segments; lat++) {
      let pathString = `M ${spherePoints[lat][0].x},${spherePoints[lat][0].y}`;
      for (let lon = 1; lon <= segments; lon++) {
        pathString += ` L ${spherePoints[lat][lon].x},${spherePoints[lat][lon].y}`;
      }
      paths.push(pathString);
    }
    for (let lon = 0; lon <= segments; lon++) {
      let pathString = `M ${spherePoints[0][lon].x},${spherePoints[0][lon].y}`;
      for (let lat = 1; lat <= segments; lat++) {
        pathString += ` L ${spherePoints[lat][lon].x},${spherePoints[lat][lon].y}`;
      }
      paths.push(pathString);
    }
    return paths;
  };

  return (
    <svg viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg" style={props.style}>
      <g fill="none" stroke="currentColor" strokeWidth="1">
        {createPaths().map((path, index) => (
          <path key={index} d={path} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
    </svg>
  );
}
