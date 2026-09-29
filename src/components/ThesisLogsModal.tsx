import React, { useState } from 'react';
import { 
  Check, 
  Copy, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  RefreshCw, 
  Trash2, 
  X 
} from 'lucide-react';
import { MissionLog } from '../types';
import { exportLogsAsCSV, exportLogsAsJSON, getMissionLogs } from '../utils/storage';
import { audio } from '../utils/audio';

interface ThesisLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThesisLogsModal: React.FC<ThesisLogsModalProps> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<MissionLog[]>(() => getMissionLogs());
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleRefresh = () => {
    audio.playClick();
    setLogs(getMissionLogs());
  };

  const handleDownloadJSON = () => {
    audio.playClick();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(exportLogsAsJSON());
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `quest_academy_edr_logs_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDownloadCSV = () => {
    audio.playClick();
    const dataStr = 'data:text/csv;charset=utf-8,' + encodeURIComponent(exportLogsAsCSV());
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `quest_academy_edr_telemetry_${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyJSON = () => {
    audio.playClick();
    navigator.clipboard.writeText(exportLogsAsJSON());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div>
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-teal-400" />
              <h2 className="font-extrabold text-base sm:text-lg text-white">
                Log Telemetri Penelitian EDR (Thesis S2)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Data aktivitas ~40 siswa Kelas 5 SD Lazuardi GCS Bogor • Framework QUEST & Digital Adab
            </p>
          </div>

          <button
            onClick={() => { audio.playClick(); onClose(); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-950/50 flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs text-slate-400">
            Total Sesi Tercatat: <strong className="text-teal-300 font-bold">{logs.length}</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs flex items-center gap-1"
              title="Perbarui Data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Segarkan</span>
            </button>

            <button
              onClick={handleCopyJSON}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs flex items-center gap-1 font-medium transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin' : 'Salin JSON'}</span>
            </button>

            <button
              onClick={handleDownloadCSV}
              className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh CSV</span>
            </button>

            <button
              onClick={handleDownloadJSON}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh JSON</span>
            </button>
          </div>
        </div>

        {/* Logs Table / Viewer */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs font-mono">
          {logs.length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-sans">
              Belum ada log sesi yang tercatat. Selesaikan salah satu misi di Hub untuk menghasilkan telemetri pertama!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border border-slate-800">
                <thead>
                  <tr className="bg-slate-800 text-slate-300">
                    <th className="p-2.5 border border-slate-700">Waktu</th>
                    <th className="p-2.5 border border-slate-700">Siswa ID</th>
                    <th className="p-2.5 border border-slate-700">Misi</th>
                    <th className="p-2.5 border border-slate-700 text-center">QUEST (120)</th>
                    <th className="p-2.5 border border-slate-700 text-center">Wara'</th>
                    <th className="p-2.5 border border-slate-700 text-center">Qoul</th>
                    <th className="p-2.5 border border-slate-700 text-center">Muraqabah</th>
                    <th className="p-2.5 border border-slate-700 text-center">Akurasi</th>
                    <th className="p-2.5 border border-slate-700 text-center">XP</th>
                    <th className="p-2.5 border border-slate-700 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, idx) => (
                    <tr key={log.id || idx} className="hover:bg-slate-800/50 text-slate-300">
                      <td className="p-2 border border-slate-800 text-slate-400">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="p-2 border border-slate-800 font-bold text-teal-300">
                        {log.player_id}
                      </td>
                      <td className="p-2 border border-slate-800 text-slate-200">
                        {log.mission_name}
                      </td>
                      <td className="p-2 border border-slate-800 text-center font-bold text-emerald-400">
                        {log.quest_scores.total}
                      </td>
                      <td className="p-2 border border-slate-800 text-center text-sky-300">
                        {log.digital_adab.wara}
                      </td>
                      <td className="p-2 border border-slate-800 text-center text-indigo-300">
                        {log.digital_adab.qoul}
                      </td>
                      <td className="p-2 border border-slate-800 text-center text-amber-300">
                        {log.digital_adab.muraqabah}
                      </td>
                      <td className="p-2 border border-slate-800 text-center">
                        {log.combat_data.accuracy_percent}%
                      </td>
                      <td className="p-2 border border-slate-800 text-center font-bold text-slate-100">
                        +{log.xp_earned.total}
                      </td>
                      <td className="p-2 border border-slate-800 text-center">
                        <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                          log.status === 'PASS' ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>Struktur data tersimpan otomatis di localStorage (offline-first).</span>
          <button
            onClick={() => { audio.playClick(); onClose(); }}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
