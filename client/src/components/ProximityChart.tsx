import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { Asteroid } from '../types/asteroid'

interface Props {
  asteroids: Asteroid[]
}

export function ProximityChart({ asteroids }: Props) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || asteroids.length === 0) return

    const containerWidth = containerRef.current.clientWidth
    const width = containerWidth
    const height = 400
    const margin = { top: 20, right: 40, bottom: 50, left: 80 }

    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const dateExtent = d3.extent(asteroids, d => new Date(d.approach_date)) as [Date, Date]

    const x = d3.scaleTime()
      .domain(dateExtent)
      .range([25, innerWidth - 25])

    const y = d3.scaleLog()
      .domain([1e6, 1e9])
      .range([innerHeight, 0])

    const size = d3.scaleSqrt()
      .domain([0, d3.max(asteroids, d => d.diameter_km) || 1])
      .range([2, 15])

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    svg.attr('width', width).attr('height', height)

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    g.append('g')
      .call(d3.axisLeft(y).tickFormat(d => (d as number / 1e6).toFixed(0) + 'M'))
      .style('color', '#666')

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).tickFormat(d => d3.timeFormat('%m/%d')(d as Date)))
      .style('color', '#666')

    g.append('g')
      .attr('stroke', '#222')
      .attr('stroke-opacity', 0.1)
      .call(d3.axisLeft(y).tickSize(-innerWidth).tickFormat(() => ''))

    // Clip path so dots never render outside chart area
    svg.append('clipPath')
      .attr('id', 'chart-area')
      .append('rect')
      .attr('x', -20)
      .attr('y', -20)
      .attr('width', innerWidth + 40)
      .attr('height', innerHeight + 40)

    g.append('g')
      .attr('clip-path', 'url(#chart-area)')
      .selectAll('.dot')
      .data(asteroids)
      .join('circle')
      .attr('cx', d => x(new Date(d.approach_date)))
      .attr('cy', d => y(d.miss_distance_km))
      .attr('r', d => size(d.diameter_km))
      .attr('fill', d => d.is_potentially_hazardous ? '#e34948' : '#3987e5')
      .attr('opacity', 0.6)
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
  }, [asteroids])

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '1rem', color: '#eee' }}>Proximity Timeline</h2>
      <div ref={containerRef} style={{ background: '#111', borderRadius: '8px', padding: '1rem' }}>
        <svg ref={svgRef} style={{ display: 'block' }} />
      </div>
    </div>
  )
}