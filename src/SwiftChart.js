import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './App.css'; // Make sure to include the styles for the font family

const SwiftChart = () => {
  const [activeChart, setActiveChart] = useState('INR');
  const svgRef = useRef();

  const width = 900;
  const height = 600;
  const margin = { top: 40, right: 40, bottom: 60, left: 100 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const rawData = [
    { company: 'Paytm', role: 'Software Engineer', city: 'Noida', salaryUSD: 30843, salaryINR: 2563053.3, experience: 4, education: 'Punjabi University, Patiala' },
    { company: 'BigBasket', role: 'Senior Software Engineer', city: 'Bengaluru', salaryUSD: 41566, salaryINR: 3454134.6, experience: 4.5, education: 'Uttar Pradesh Technical University (UPTU)' },
    { company: 'Paytm', role: 'Software Engineer', city: 'Pune', salaryUSD: 18072, salaryINR: 1501783.2, experience: 3.25, education: 'Fergusson College, Pune' },
    { company: 'Swiggy', role: 'Software Engineer', city: 'Bengaluru', salaryUSD: 33735, salaryINR: 2803378.5, experience: 3.42, education: 'Indian Institute Of Technology, Kharagpur' },
    { company: 'Paytm Money', role: 'Software Engineer', city: 'Hyderabad', salaryUSD: 21084, salaryINR: 1752080.4, experience: 4, education: 'CVR College of Engineering, Hyderabad' },
    { company: 'Flipkart', role: 'Software Engineer', city: 'Bengaluru', salaryUSD: 36867, salaryINR: 3063647.7, experience: 2.33, education: 'Malviya National Institute of Technology, Jaipur' },
    { company: 'Nykaa', role: 'Software Engineer', city: 'Ghaziabad', salaryUSD: 34940, salaryINR: 2903514, experience: 5, education: 'R D Engineering College' },
    { company: 'Paytm', role: 'Software Engineer', city: 'Bengaluru', salaryUSD: 25101, salaryINR: 2085893.1, experience: 2.58, education: 'International Institute of Information Technology' },
    { company: 'Dream11', role: 'Software Engineer', city: 'Rajkot', salaryUSD: 43373, salaryINR: 3604296.3, experience: 4, education: 'Chitkara Institute of Engineering & Technology, Rajpura' },
    { company: 'MakeMyTrip', role: 'Software Engineer', city: 'Bengaluru', salaryUSD: 27108, salaryINR: 2252674.8, experience: 2, education: 'National Institute Of Technology' },
    { company: 'Cars24', role: 'Software Engineer', city: 'Bengaluru', salaryUSD: 38554, salaryINR: 3203837.4, experience: 2.75, education: 'National Institute of Technology, Hamirpur' }
  ];

  useEffect(() => {
    if (rawData.length === 0) return;

    // Set up SVG and scales
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear existing content

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear()
      .domain([1.5, 5])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain(activeChart === 'INR' ? [0, 4000000] : [0, 50000])
      .range([innerHeight, 0]);

    // X-axis
    const xAxis = g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).tickValues([1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]));

    xAxis.selectAll("text")
      .attr('font-size', '12px')
      .attr('font-family', 'Onest');

    xAxis.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', 40)
      .attr('fill', 'black')
      .attr('font-family', 'Onest')
      .attr('font-size', '16px')
      .text('Years of Experience');

    // Y-axis
    const yAxis = g.append('g')
      .call(activeChart === 'INR' 
        ? d3.axisLeft(yScale).tickValues([0,  500000, 1000000, 1500000, 2000000, 2500000, 3000000, 3500000, 4000000])
        : d3.axisLeft(yScale).tickValues([0, 10000, 20000, 30000, 40000, 50000]));

    yAxis.selectAll("text")
      .attr('font-size', '12px')
      .attr('font-family', 'Onest');

    yAxis.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 0)
      .attr('x', -innerHeight / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .attr('font-family', 'Onest')
      .attr('fill', 'black')
      .attr('font-size', '16px')
      .text(`Current Salary (${activeChart})`);

    const make_x_gridlines = () => d3.axisBottom(xScale).ticks(10);
    const make_y_gridlines = () => d3.axisLeft(yScale).ticks(10);

    g.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(make_x_gridlines()
        .tickSize(-innerHeight)
        .tickFormat("")
      );

    g.append("g")
      .attr("class", "grid")
      .call(make_y_gridlines()
        .tickSize(-innerWidth)
        .tickFormat("")
      );

    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("font-family", "Onest")
      .style("text-align", "left"); 
      

    const circles = g.selectAll('circle')
      .data(rawData)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.experience))
      .attr('cy', d => yScale(activeChart === 'INR' ? d.salaryINR : d.salaryUSD))
      .attr('r', 5)
      .attr('fill', '#005dff')
      .on("mouseover", (event, d) => {
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip.html(`Company: ${d.company}<br/>
                      Role: ${d.role}<br/>
                      City: ${d.city}<br/>
                      Experience: ${d.experience} years<br/>
                      Salary (${activeChart}): ${activeChart === 'INR' ? d.salaryINR.toLocaleString() : d.salaryUSD.toLocaleString()}<br/>
                      Education: ${d.education}`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", () => {
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });

    g.selectAll('text.company')
      .data(rawData)
      .enter()
      .append('text')
      .attr('class', 'company')
      .attr('x', d => xScale(d.experience))
      .attr('y', d => yScale(activeChart === 'INR' ? d.salaryINR : d.salaryUSD) - 10)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'Onest')
      .attr('font-size', '12px')
      .attr('fill', '#005dff')
      .text(d => d.company);

  }, [activeChart, rawData]);

  const buttonStyle = {
    padding: '10px 20px',
    margin: '0 2px',
    border: '2px solid #000',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    fontFamily: 'Onest'
  };

  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'blue',
    color: 'white',
  };

  const inactiveButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'white',
    color: 'black',
  };

  return (
    <div className="App" style={{ fontFamily: 'Onest', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px', paddingRight: '180px', paddingTop: '10px' }}>
        <button 
          style={activeChart === 'INR' ? activeButtonStyle : inactiveButtonStyle}
          onClick={() => setActiveChart('INR')}
        >
          INR
        </button>
        <button 
          style={activeChart === 'USD' ? activeButtonStyle : inactiveButtonStyle}
          onClick={() => setActiveChart('USD')}
        >
          USD
        </button>
      </div>
      <svg ref={svgRef} width={width} height={height}></svg>
    </div>
  );
};

export default SwiftChart;