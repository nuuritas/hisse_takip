// Add an event listener to the "Update Table" button
$('#update-button').on('click', function() {
    const sheetId = "YOUR_SHEET_ID";
    const range = "Sheet1!A1:E10";
    const apiKey = "AIzaSyCrO9EFJztzVeVh6w8iqlV44VnlyC91_PA";
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
  
    fetchData(url);
  });
  
  function fetchData(url) {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(data => {
        const headers = data.values[0];
        const rows = data.values.slice(1);
  
        const columns = headers.map(header => ({ title: header }));
  
        const table = $('#data-table').DataTable({
          data: rows,
          columns: columns
        });
      })
      .catch(error => {
        console.error(error);
        // Display an error message to the user
        $('#table-container').html('<p>Error fetching data from Google Sheets.</p>');
      });
  }
  