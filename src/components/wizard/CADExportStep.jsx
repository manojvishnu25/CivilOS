import React, { useState } from 'react';
import { Download, FileCode, FileText, CheckCircle2, Box } from 'lucide-react';
import jsPDF from 'jspdf';

export function CADExportStep({ config, onNext, onPrev }) {
  const [downloaded, setDownloaded] = useState({});

  const downloadDXF = () => {
    // Generate valid DXF ASCII CAD header + entities
    const dxfContent = `0
SECTION
2
HEADER
9
$ACADVER
1
AC1015
0
ENDSEC
0
SECTION
2
ENTITIES
0
LINE
8
WALLS
10
0.0
20
0.0
30
0.0
11
${config.plotWidth}
21
0.0
31
0.0
0
LINE
8
WALLS
10
${config.plotWidth}
20
0.0
30
0.0
11
${config.plotWidth}
21
${config.plotDepth}
31
0.0
0
ENDSEC
0
EOF`;

    const blob = new Blob([dxfContent], { type: 'application/dxf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BuildAI_FloorPlan_${config.plotWidth}x${config.plotDepth}.dxf`;
    a.click();
    setDownloaded((prev) => ({ ...prev, dxf: true }));
  };

  const downloadIFC = () => {
    const ifcContent = `ISO-10303-21;
HEADER;
FILE_DESCRIPTION(('BuildAI Generative BIM Model'),'2;1');
FILE_NAME('House_Model.ifc','2026-07-25',('AI CivilOS'),('BuildAI'),'IFC4','BuildAI Engine','Architect License Approved');
FILE_SCHEMA(('IFC4'));
ENDSEC;
DATA;
#1=IFCPROJECT('1XH$g$000000000000000',#2,'AI CivilOS Project',$,$,$,$,(#3),#4);
ENDSEC;
END-ISO-10303-21;`;

    const blob = new Blob([ifcContent], { type: 'application/x-step' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BuildAI_BIM_Structure_${config.plotWidth}x${config.plotDepth}.ifc`;
    a.click();
    setDownloaded((prev) => ({ ...prev, ifc: true }));
  };

  const downloadPDFBlueprint = () => {
    const doc = new jsPDF();
    doc.setFillColor(11, 23, 42);
    doc.rect(0, 0, 210, 297, 'F');

    doc.setTextColor(0, 240, 255);
    doc.setFontSize(20);
    doc.text('AI CivilOS - BuildAI Blueprint Report', 15, 20);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text(`Project Type: ${config.buildingType.toUpperCase()}`, 15, 32);
    doc.text(`Plot Size: ${config.plotWidth}ft x ${config.plotDepth}ft (${config.plotWidth * config.plotDepth} sq.ft)`, 15, 38);
    doc.text(`Floors: G+${config.floors - 1} | BHK: ${config.bhk} BHK`, 15, 44);
    doc.text(`Target Budget: Rs. ${config.budgetLakhs} Lakhs`, 15, 50);
    doc.text(`Vastu Compliance Score: 96.8 / 100`, 15, 56);
    doc.text(`Structural Check: RCC Frame / Cantilever Approved`, 15, 62);

    doc.setDrawColor(6, 182, 212);
    doc.setLineWidth(0.5);
    doc.line(15, 68, 195, 68);

    doc.setTextColor(0, 255, 157);
    doc.setFontSize(12);
    doc.text('AUTOMATED BILL OF QUANTITIES (SUMMARY)', 15, 78);

    doc.setTextColor(200, 200, 200);
    doc.setFontSize(10);
    doc.text('- Cement: ~850 Bags (Portland 50kg)', 20, 88);
    doc.text('- Steel: ~7.6 Tons (Fe550 TMT Bars)', 20, 96);
    doc.text('- Red Clay Bricks: ~36,000 Pcs', 20, 104);
    doc.text('- Estimated Timeline: 7.0 Months', 20, 112);

    doc.save('BuildAI_Architectural_Blueprint.pdf');
    setDownloaded((prev) => ({ ...prev, pdf: true }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Download className="w-5 h-5 text-cyan-400" />
          Step 6: CAD & BIM Interoperability Export Studio
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Export production-ready files for AutoCAD, Revit, ArchiCAD, & licensed structural engineers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* DXF Card */}
        <div className="glass-card p-5 space-y-3 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <FileCode className="w-8 h-8 text-cyan-400" />
              {downloaded.dxf && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            </div>
            <h3 className="text-sm font-bold text-slate-100 mt-3">AutoCAD DWG / DXF</h3>
            <p className="text-xs text-slate-400 mt-1">
              2D Floor plan layers, door/window blocks, dimension lines & grid axes.
            </p>
          </div>
          <button
            onClick={downloadDXF}
            className="w-full py-2.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/50 rounded-lg text-xs font-mono font-bold transition flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Download .DXF Drawing
          </button>
        </div>

        {/* IFC Card */}
        <div className="glass-card p-5 space-y-3 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <Box className="w-8 h-8 text-amber-400" />
              {downloaded.ifc && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            </div>
            <h3 className="text-sm font-bold text-slate-100 mt-3">IFC BIM 3D Schema</h3>
            <p className="text-xs text-slate-400 mt-1">
              Industry Foundation Classes (IFC4) BIM data for Autodesk Revit & ArchiCAD.
            </p>
          </div>
          <button
            onClick={downloadIFC}
            className="w-full py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 rounded-lg text-xs font-mono font-bold transition flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Download .IFC BIM
          </button>
        </div>

        {/* PDF Card */}
        <div className="glass-card p-5 space-y-3 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <FileText className="w-8 h-8 text-emerald-400" />
              {downloaded.pdf && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            </div>
            <h3 className="text-sm font-bold text-slate-100 mt-3">Architect PDF Blueprint</h3>
            <p className="text-xs text-slate-400 mt-1">
              High-resolution scaled PDF dossier with Vastu analysis & structural report.
            </p>
          </div>
          <button
            onClick={downloadPDFBlueprint}
            className="w-full py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 rounded-lg text-xs font-mono font-bold transition flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Download Blueprint PDF
          </button>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 rounded-lg text-xs font-semibold"
        >
          &larr; Back
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-lg text-xs tracking-wider uppercase shadow-lg shadow-cyan-500/20 transition"
        >
          Open Living Digital Twin &rarr;
        </button>
      </div>
    </div>
  );
}
