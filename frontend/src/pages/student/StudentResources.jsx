import React, { useState, useEffect, useRef } from 'react';
import { resourcesService } from '../../api/resources';
import { playHapticChime } from '../../utils/sound';
import { Modal } from '../../components/common/Modal';
import HoldButton from '../../components/common/HoldButton';
import toast from 'react-hot-toast';
import {
  FolderDown,
  BookOpen,
  FileText,
  UploadCloud,
  Download,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  User,
  GraduationCap,
  Sparkles,
  FileCode,
  FileImage,
  FileArchive,
  Eye,
  Plus,
  X,
  Tag,
  Layers,
  HardDrive,
  FileCheck
} from 'lucide-react';

const ENROLLED_SUBJECTS = [
  { code: 'CS501', name: 'Database Management Systems', staff: 'Prof. Ramesh Sharma' },
  { code: 'CS502', name: 'Operating Systems', staff: 'Prof. Priya Verma' },
  { code: 'CS503', name: 'Computer Networks', staff: 'Prof. Ramesh Sharma' },
  { code: 'CS504', name: 'Theory of Computation', staff: 'Prof. Priya Verma' }
];

const CATEGORIES = [
  'Lecture Notes',
  'Revision Cheatsheet',
  'Lab Assignment',
  'Question Bank',
  'Reference Book',
  'Other'
];

export const StudentResources = () => {
  const [activeTab, setActiveTab] = useState('staff'); // 'staff' | 'student'
  const [staffNotes, setStaffNotes] = useState(() => resourcesService.getStaffNotes());
  const [studentResources, setStudentResources] = useState(() => resourcesService.getStudentResources());
  
  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFormData, setUploadFormData] = useState({
    title: '',
    subjectCode: 'CS501',
    category: 'Lecture Notes',
    notes: '',
    file: null,
    fileType: 'PDF',
    fileSize: '1.2 MB'
  });
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Preview Modal State
  const [previewItem, setPreviewItem] = useState(null);

  // Synchronize across tabs or live updates
  useEffect(() => {
    const handleUpdate = () => {
      setStaffNotes(resourcesService.getStaffNotes());
      setStudentResources(resourcesService.getStudentResources());
    };
    window.addEventListener('resources-updated', handleUpdate);
    return () => window.removeEventListener('resources-updated', handleUpdate);
  }, []);

  // Filtered lists
  const filteredStaffNotes = staffNotes.filter((note) => {
    const matchesSubject = selectedSubject === 'ALL' || note.subjectCode === selectedSubject;
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.description && note.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSubject && matchesSearch;
  });

  const filteredStudentResources = studentResources.filter((res) => {
    const matchesSubject = selectedSubject === 'ALL' || res.subjectCode === selectedSubject;
    const matchesCategory = selectedCategory === 'ALL' || res.category === selectedCategory;
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (res.notes && res.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSubject && matchesCategory && matchesSearch;
  });

  // Handle Drag & Drop / File Selection
  const handleFilePicked = (file) => {
    if (!file) return;
    const ext = file.name.split('.').pop().toUpperCase();
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    const sizeStr = file.size > 1024 * 1024 ? `${sizeInMb} MB` : `${Math.round(file.size / 1024)} KB`;
    
    // Auto-fill title from filename
    const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

    setUploadFormData((prev) => ({
      ...prev,
      file,
      fileType: ext || 'PDF',
      fileSize: sizeStr,
      title: prev.title.trim() === '' ? cleanTitle : prev.title
    }));
    playHapticChime();
    toast.success(`Attached file: ${file.name}`);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFilePicked(e.dataTransfer.files[0]);
    }
  };

  // Submit Uploaded Resource
  const handleSaveResource = () => {
    if (!uploadFormData.title.trim()) {
      toast.error('Please enter a title for the resource.');
      return;
    }

    const matchedSub = ENROLLED_SUBJECTS.find((s) => s.code === uploadFormData.subjectCode);

    resourcesService.addStudentResource({
      title: uploadFormData.title.trim(),
      subjectCode: uploadFormData.subjectCode,
      subjectName: matchedSub ? matchedSub.name : 'Computer Science Subject',
      category: uploadFormData.category,
      fileType: uploadFormData.fileType,
      fileSize: uploadFormData.fileSize,
      notes: uploadFormData.notes.trim()
    });

    playHapticChime();
    toast.success('Resource saved to your personal study locker!', { icon: '📁' });

    // Reset and close
    setUploadFormData({
      title: '',
      subjectCode: 'CS501',
      category: 'Lecture Notes',
      notes: '',
      file: null,
      fileType: 'PDF',
      fileSize: '1.2 MB'
    });
    setIsUploadModalOpen(false);
    setActiveTab('student'); // Switch to student tab so they see their upload immediately
  };

  // Download Action
  const handleDownload = (item) => {
    playHapticChime();
    resourcesService.downloadResource(item);
    if (item.isStaffNote) {
      resourcesService.incrementDownloadCount(item.id);
    }
    toast.success(`Downloading: ${item.title}`, { icon: '📥' });
  };

  // Delete Action
  const handleDeleteResource = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}" from your resources locker?`)) {
      resourcesService.deleteStudentResource(id);
      playHapticChime();
      toast.success('Resource deleted from locker.');
    }
  };

  // File icon helper
  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'PDF':
        return <FileText className="w-5 h-5 text-rose-500" />;
      case 'DOCX':
      case 'DOC':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'PPT':
      case 'PPTX':
        return <FileText className="w-5 h-5 text-amber-500" />;
      case 'PNG':
      case 'JPG':
      case 'JPEG':
        return <FileImage className="w-5 h-5 text-emerald-500" />;
      case 'TXT':
        return <FileCode className="w-5 h-5 text-slate-500" />;
      default:
        return <FileText className="w-5 h-5 text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. HERO HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wide">
              Semester 5 • CSE
            </span>
            <span className="text-xs font-bold text-slate-400">Section A</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
            <FolderDown className="w-7 h-7 text-primary-600" />
            <span>Academic Resources & Notes</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Access official lecture notes and question banks shared by faculty, or upload and store your personal study notes in your private locker.
          </p>
        </div>

        {/* Primary Action Button */}
        <button
          type="button"
          onClick={() => {
            playHapticChime();
            setIsUploadModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload New Resource</span>
        </button>
      </div>

      {/* 2. STATS & STORAGE CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block leading-tight">Faculty Notes</span>
            <span className="text-base sm:text-lg font-black text-slate-900 leading-tight">
              {staffNotes.length} Guides Available
            </span>
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block leading-tight">My Stored Notes</span>
            <span className="text-base sm:text-lg font-black text-slate-900 leading-tight">
              {studentResources.length} Personal Files
            </span>
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block leading-tight">Subjects Covered</span>
            <span className="text-base sm:text-lg font-black text-slate-900 leading-tight">
              4 Semester Courses
            </span>
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block leading-tight">Cloud Storage</span>
            <span className="text-base sm:text-lg font-black text-slate-900 leading-tight">
              3.1 MB / 50 MB
            </span>
          </div>
        </div>
      </div>

      {/* 3. TABS SWITCHER & CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
        {/* Modern Tab Selector */}
        <div className="inline-flex p-1 rounded-2xl bg-slate-100 border border-slate-200/80 self-start">
          <button
            type="button"
            onClick={() => {
              setActiveTab('staff');
              playHapticChime();
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'staff'
                ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Notes from Faculty</span>
            <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
              {staffNotes.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('student');
              playHapticChime();
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'student'
                ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FolderDown className="w-4 h-4 text-indigo-600" />
            <span>My Stored Resources</span>
            <span className="px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold">
              {studentResources.length}
            </span>
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes, topics or authors..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white border border-slate-200/80 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200/80 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 shadow-2xs cursor-pointer"
          >
            <option value="ALL">All Subjects</option>
            {ENROLLED_SUBJECTS.map((sub) => (
              <option key={sub.code} value={sub.code}>
                {sub.code} - {sub.name}
              </option>
            ))}
          </select>

          {/* Category Filter for Personal Notes */}
          {activeTab === 'student' && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200/80 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 shadow-2xs cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* 4. TAB CONTENT 1: NOTES FROM FACULTY */}
      {activeTab === 'staff' && (
        <div className="space-y-4">
          {filteredStaffNotes.length === 0 ? (
            <div className="p-10 rounded-3xl bg-white border border-slate-200/80 text-center space-y-3">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">No faculty notes match your filter</h3>
              <p className="text-xs text-slate-500">Try clearing your search query or selecting "All Subjects".</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSubject('ALL');
                }}
                className="px-4 py-1.5 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs hover:bg-blue-100 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStaffNotes.map((note) => (
                <div
                  key={note.id}
                  className="rounded-3xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all p-5 flex flex-col justify-between group hover:border-blue-300"
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 font-bold text-[11px]">
                        {note.subjectCode}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 font-bold text-[10px]">
                          {note.fileType}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {note.fileSize}
                        </span>
                      </div>
                    </div>

                    {/* Title & Subject */}
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                      {note.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 mt-1">
                      {note.subjectName}
                    </p>

                    {/* Faculty Byline */}
                    <div className="flex items-center gap-1.5 mt-2.5 text-xs text-slate-600">
                      <User className="w-3.5 h-3.5 text-indigo-500" />
                      <span className="font-medium">{note.staffName}</span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
                        Verified Faculty
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-500 mt-2.5 line-clamp-2 leading-relaxed">
                      {note.description}
                    </p>

                    {/* Topics Covered Pills */}
                    {note.topics && note.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {note.topics.slice(0, 3).map((topic, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/60 text-[10px] text-slate-600 font-medium truncate max-w-[170px]"
                          >
                            #{topic}
                          </span>
                        ))}
                        {note.topics.length > 3 && (
                          <span className="text-[10px] text-slate-400 font-bold self-center">
                            +{note.topics.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Bottom Footer & Action Buttons */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="text-[10px] text-slate-400 flex flex-col">
                      <span>{note.pages} pages • {note.date}</span>
                      <span className="text-slate-500 font-medium mt-0.5">
                        {note.downloadCount} student downloads
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewItem(note)}
                        title="Quick Preview"
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownload(note)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-2xs cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. TAB CONTENT 2: MY STORED RESOURCES (PERSONAL STUDY LOCKER) */}
      {activeTab === 'student' && (
        <div className="space-y-4">
          {filteredStudentResources.length === 0 ? (
            <div className="p-10 rounded-3xl bg-white border border-dashed border-slate-300 text-center space-y-3">
              <UploadCloud className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">Your Study Locker is Empty</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Upload your handwritten study sheets, lab codes, and reference PDFs to keep them synchronized across your devices.
              </p>
              <button
                type="button"
                onClick={() => {
                  playHapticChime();
                  setIsUploadModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Your First Note</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStudentResources.map((res) => (
                <div
                  key={res.id}
                  className="rounded-3xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all p-5 flex flex-col justify-between group hover:border-indigo-300"
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-[11px]">
                          {res.subjectCode}
                        </span>
                        <span className="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200/70 font-bold text-[10px]">
                          {res.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 font-bold text-[10px]">
                          {res.fileType}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {res.fileSize}
                        </span>
                      </div>
                    </div>

                    {/* Title & Subject */}
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                      {res.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 mt-1">
                      {res.subjectName}
                    </p>

                    {/* Personal Notes / Memo */}
                    {res.notes && (
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 mt-3 text-xs text-slate-600 italic leading-relaxed">
                        "{res.notes}"
                      </div>
                    )}
                  </div>

                  {/* Bottom Footer & Action Buttons */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-400">
                      Uploaded {res.uploadDate}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewItem(res)}
                        title="View Details"
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownload(res)}
                        title="Download Note"
                        className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteResource(res.id, res.title)}
                        title="Delete from Locker"
                        className="p-2 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 text-xs transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. MODAL: UPLOAD NEW RESOURCE */}
      {isUploadModalOpen && (
        <Modal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          title="Upload Resource to Study Locker"
          subtitle="Store notes, question papers, or lab programs in your private repository."
          maxWidth="max-w-lg"
        >
          <div className="space-y-4">
            {/* Drag & Drop File Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-2 ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-50/60'
                  : uploadFormData.file
                  ? 'border-emerald-400 bg-emerald-50/30'
                  : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.docx,.doc,.pptx,.txt,.png,.jpg,.jpeg"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFilePicked(e.target.files[0]);
                  }
                }}
              />

              {uploadFormData.file ? (
                <>
                  <FileCheck className="w-10 h-10 text-emerald-600" />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block truncate max-w-xs">
                      {uploadFormData.file.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {uploadFormData.fileType} • {uploadFormData.fileSize} (Ready to save)
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-indigo-600 hover:underline">
                    Click to replace file
                  </span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-10 h-10 text-indigo-500" />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      Click to browse or drag and drop files here
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Supports PDF, DOCX, PPTX, TXT, PNG, JPG (up to 25 MB)
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Title Input */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Resource Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={uploadFormData.title}
                onChange={(e) => setUploadFormData({ ...uploadFormData, title: e.target.value })}
                placeholder="e.g. Unit 3 B+ Tree Normalization Cheatsheet"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Subject and Category Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Enrolled Subject
                </label>
                <select
                  value={uploadFormData.subjectCode}
                  onChange={(e) => setUploadFormData({ ...uploadFormData, subjectCode: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  {ENROLLED_SUBJECTS.map((sub) => (
                    <option key={sub.code} value={sub.code}>
                      {sub.code} - {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Resource Category
                </label>
                <select
                  value={uploadFormData.category}
                  onChange={(e) => setUploadFormData({ ...uploadFormData, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Personal Notes / Memo */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Personal Memo / Revision Notes (Optional)
              </label>
              <textarea
                rows={3}
                value={uploadFormData.notes}
                onChange={(e) => setUploadFormData({ ...uploadFormData, notes: e.target.value })}
                placeholder="Key formulas, important reminders, or faculty instructions..."
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>

              <HoldButton
                size="md"
                backgroundColor="#4f46e5"
                fillColor="#22c55e"
                textColor="#ffffff"
                fillTextColor="#ffffff"
                radius={14}
                holdTime={900}
                releaseTime={200}
                pressScale={0.97}
                wave
                glow
                doneLabel="Saved!"
                onHold={handleSaveResource}
                onTap={handleSaveResource}
                className="shadow-sm font-bold text-xs"
              >
                Hold to Save Resource
              </HoldButton>
            </div>
          </div>
        </Modal>
      )}

      {/* 7. MODAL: RESOURCE QUICK PREVIEW */}
      {previewItem && (
        <Modal
          isOpen={Boolean(previewItem)}
          onClose={() => setPreviewItem(null)}
          title={previewItem.title}
          subtitle={`${previewItem.subjectCode} • ${previewItem.subjectName}`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-4">
            {/* Meta Row */}
            <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-slate-100">
              <span className="px-2.5 py-1 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs">
                Format: {previewItem.fileType}
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">
                Size: {previewItem.fileSize}
              </span>
              {previewItem.pages && (
                <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">
                  {previewItem.pages} Pages
                </span>
              )}
              <span className="text-xs text-slate-400 ml-auto">
                {previewItem.date || previewItem.uploadDate}
              </span>
            </div>

            {/* Author / Source */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                {previewItem.staffName ? previewItem.staffName[0] : 'S'}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  {previewItem.staffName || previewItem.uploadedBy}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {previewItem.isStaffNote ? 'Course Instructor • Computer Science Dept' : 'Personal Study Locker'}
                </span>
              </div>
            </div>

            {/* Overview / Notes */}
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1">
                Summary & Content Overview
              </span>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed max-h-48 overflow-y-auto">
                <p>{previewItem.description || previewItem.notes || 'No description provided.'}</p>
                {previewItem.topics && previewItem.topics.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <span className="font-bold text-slate-900 block mb-1.5">Topics in this Document:</span>
                    <ul className="list-disc pl-5 space-y-1 text-slate-600">
                      {previewItem.topics.map((t, idx) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Preview Footer Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Close Preview
              </button>

              <button
                type="button"
                onClick={() => {
                  handleDownload(previewItem);
                  setPreviewItem(null);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download Document</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StudentResources;
