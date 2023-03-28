function fetchData() {
  const sheetId = "1Hgec6ktnrIAqXL90cVrTsn5rOS9cHI6KnerQ9Lc3kt0";
  const range = "summary!a1:g12";
  const apiKey = "AIzaSyCrO9EFJztzVeVh6w8iqlV44VnlyC91_PA";

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      // console.log(data.values);
      const table = $('#data-table').DataTable({
        data: data.values.slice(1),
        columns: data.values[0].map(header => ({ title: header })),
        paging: false,
        searching : false,
        info: false,
        lengthChange: false
      });
      // initialize DataTable with table object
      table.draw();
    })
    .catch(error => console.error(error));
    
}