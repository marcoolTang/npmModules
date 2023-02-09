import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export default {
  outputPdf: async (ele, options) => {
    var title = options.htmlTitle;
    html2canvas(ele, {
        useCORS: true,
        allowTaint: true,
    }).then(async (canvas) => {
      let contentWidth = canvas.width;
      let contentHeight = canvas.height;
      let pageHeight = (contentWidth / 592.28) * 841.89;
      let leftHeight = contentHeight;
      let position = 0;
      let imgWidth = 595.28;
      let imgHeight = (592.28 / contentWidth) * contentHeight;
      let pageData = canvas.toDataURL("image/jpeg", 1.0);
      let PDF = new jsPDF("", "pt", "a4");
      if (leftHeight < pageHeight) {
        PDF.addImage(pageData, "JPEG", 0, 0, imgWidth, imgHeight);
      } else {
        while (leftHeight > 0) {
          PDF.addImage(pageData, "JPEG", 0, position, imgWidth, imgHeight);
          leftHeight -= pageHeight;
          position -= 841.89;
          if (leftHeight > 0) {
            PDF.addPage();
          }
        }
      }
      if(options.beforeDownload && typeof options.beforeDownload =="function" ){
        await options.beforeDownload();
      }
      await PDF.save(title + ".pdf");
      if(options.afterDownload && typeof options.afterDownload =="function" ){
        await options.afterDownload();
      }
    });
  },
};
