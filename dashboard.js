function displayDashboard() {
    $('#content-container').load('dashboard.html', function() {
        createChart();
        fetchPortfolio();
        fetchPortfolio2();
        setCurrentDate();
        total_money();

        
        $('.tab-link').click(function(){
            const tabId = $(this).attr('table-tab');
            $('.tab-link').removeClass('current');
            $('.tab-content').removeClass('current');
            $(this).addClass('current');
            $('#'+tabId).addClass('current');
        });
    });
}

// Logout button click event
$('#logout-button').click(function() {
    window.location.href = 'index.html';
});
  