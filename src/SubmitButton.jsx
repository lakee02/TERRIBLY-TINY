import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function SubmitButton({ setData }) {
  const [wordCounts, setWordCounts] = useState([]);

  function handleClick() {
    fetch('https://www.terriblytinytales.com/test.txt')
      .then(response => response.text())
      .then(data => {
        // Parse the text data and count the occurrence of each word
        const words = data.toLowerCase().split(/[^\w']+/);
        const counts = {};
        for (let i = 0; i < words.length; i++) {
          const word = words[i];
          if (counts[word] === undefined) {
            counts[word] = 1;
          } else {
            counts[word]++;
          }
        }

        // Sort the word counts in descending order and take the top 20 most occurring words
        const sortedCounts = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 20);
        setWordCounts(sortedCounts);

        setData(data); // Pass the data to the parent component
      })
      .catch(error => console.log('Error fetching data:', error));
  }

  function handleExportClick() {
    // Generate the CSV data
    const csvData = wordCounts.map(wordCount => `${wordCount[0]},${wordCount[1]}`).join('\n');
    // Trigger a download
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'histogram_data.csv');
    link.click();
  }

  return (
    <div>
      <button onClick={handleClick}>Submit</button>
      {wordCounts.length > 0 && (
        <div>
          <h2>Top 20 most occurring words</h2>
          <BarChart width={500} height={300} data={wordCounts}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="0" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="1" fill="#8884d8" />
          </BarChart>
          <button onClick={handleExportClick}>Export</button>
        </div>
      )}
    </div>
  );
}

export default SubmitButton;
