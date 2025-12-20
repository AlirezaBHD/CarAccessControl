using CarAccessControl.Application.Common.Interfaces;
using CarAccessControl.Application.Features.AccessEvents.Dtos;
using ClosedXML.Excel;

namespace CarAccessControl.Infrastructure.Services;

public class ExcelReportService : IExcelReportService
{
    public async Task<byte[]> GenerateAccessEventReportAsync(List<EventListDto> events, DateTime fromDate,
        DateTime toDate)
    {
        return await Task.Run(() =>
        {
            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("Parking Access Report");

            CreateReportHeader(worksheet, fromDate, toDate, events.Count);

            CreateTableHeaders(worksheet);

            FillData(worksheet, events);

            ApplyStyles(worksheet, events.Count);

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            return stream.ToArray();
        });
    }

    private void CreateReportHeader(IXLWorksheet worksheet, DateTime fromDate, DateTime toDate, int totalRecords)
    {
        worksheet.Cell("A1").Value = "Parking Access Report";
        worksheet.Cell("A1").Style.Font.FontSize = 16;
        worksheet.Cell("A1").Style.Font.Bold = true;
        worksheet.Range("A1:I1").Merge();

        worksheet.Cell("F2").Value = $"From: {fromDate:yyyy/MM/dd}";
        worksheet.Cell("C2").Value = $"To: {toDate:yyyy/MM/dd}";

        worksheet.Cell("A3").Value = $"Total Records: {totalRecords}";
        worksheet.Range("A3:I3").Merge();

        worksheet.Cell("A4").Value = "";
    }

    private void CreateTableHeaders(IXLWorksheet worksheet)
    {
        var headers = new[]
        {
            "No.", "ID", "License Plate", "Vehicle Name", "First Name", "Last Name",
            "Gate", "Type", "Date & Time"
        };

        for (int i = 0; i < headers.Length; i++)
        {
            worksheet.Cell(5, i + 1).Value = headers[i];
        }
    }

    private void FillData(IXLWorksheet worksheet, List<EventListDto> events)
    {
        int row = 6;
        int counter = 1;

        foreach (var eventItem in events)
        {
            worksheet.Cell(row, 1).Value = counter;
            worksheet.Cell(row, 2).Value = eventItem.Id;
            
            worksheet.Cell(row, 3).Value = eventItem.PlateNumber; 
            
            worksheet.Cell(row, 4).Value = eventItem.VehicleName ?? "-";
            worksheet.Cell(row, 5).Value = eventItem.OwnerFirstName ?? "-";
            worksheet.Cell(row, 6).Value = eventItem.OwnerSurname;
            worksheet.Cell(row, 7).Value = eventItem.GateName;
            worksheet.Cell(row, 8).Value = eventItem.Enter ? "Entry" : "Exit";
            worksheet.Cell(row, 9).Value = eventItem.CreatedOn;
            
            worksheet.Cell(row, 9).Style.DateFormat.Format = "yyyy/MM/dd HH:mm:ss"; 

            var rowDataRange = worksheet.Range(row, 1, row, 9);

            rowDataRange.Style.Fill.BackgroundColor = eventItem.IsAllowed ? XLColor.LightGreen : XLColor.LightCoral;

            row++;
            counter++;
        }
    }

    private void ApplyStyles(IXLWorksheet worksheet, int dataRowCount)
    {
        var headerRange = worksheet.Range(5, 1, 5, 9);
        headerRange.Style.Fill.BackgroundColor = XLColor.DarkBlue;
        headerRange.Style.Font.FontColor = XLColor.White;
        headerRange.Style.Font.Bold = true;
        headerRange.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

        var dataRange = worksheet.Range(5, 1, 5 + dataRowCount, 9);
        dataRange.Style.Border.OutsideBorder = XLBorderStyleValues.Medium;
        dataRange.Style.Border.InsideBorder = XLBorderStyleValues.Thin;

        worksheet.Columns().AdjustToContents();
        worksheet.Column(1).Width = 8;  // No
        worksheet.Column(2).Width = 10; // ID

        worksheet.Columns().Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Left; 
        worksheet.Columns().Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;

        worksheet.Column(1).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
        worksheet.Column(2).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
        worksheet.Column(8).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center; // Type
        worksheet.Column(9).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center; // Date

        worksheet.Row(1).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
        worksheet.Row(3).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Left;
    }
}