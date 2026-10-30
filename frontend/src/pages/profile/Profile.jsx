import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import Lanyard from '../../components/common/Lanyard';
import { generateIdCardTextures } from '../../utils/idCardGenerator';
import {
  ShieldCheck,
  Award,
  Sparkles,
  Download,
  RotateCw,
  Mail,
  Phone,
  User,
  GraduationCap,
  Building,
  Calendar,
  Layers,
  ArrowLeft,
  CheckCircle2,
  Sliders,
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

export const Profile = () => {
  const { user, role } = useAuth();

  // Lanyard interactive customization state
  const [finish, setFinish] = useState('holographic');
  const [metal, setMetal] = useState('silver');
  const [breeze, setBreeze] = useState(0.5);

  // Generate dynamic 3D ID card textures
  const textures = useMemo(() => {
    return generateIdCardTextures(user, role);
  }, [user, role]);

  const handleDownloadCard = () => {
    if (!textures.frontImage) return;
    const a = document.createElement('a');
    a.href = textures.frontImage;
    a.download = `${(user?.full_name || 'student').toLowerCase().replace(/\s+/g, '_')}_digital_id.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('Digital ID Badge downloaded successfully!');
  };

  const roleLabels = {
    ADMIN: 'System Administrator',
    STAFF: 'Senior Faculty Member',
    STUDENT: 'Undergraduate Student',
    PARENT: 'Registered Guardian'
  };

  const roleColors = {
    ADMIN: 'from-amber-500 to-amber-700 text-amber-100 border-amber-400/40',
    STAFF: 'from-indigo-600 to-indigo-800 text-indigo-100 border-indigo-400/40',
    STUDENT: 'from-cyan-600 to-cyan-800 text-cyan-100 border-cyan-400/40',
    PARENT: 'from-emerald-600 to-emerald-800 text-emerald-100 border-emerald-400/40'
  };

  const getDashboardPath = () => {
    switch (role) {
      case 'ADMIN':
        return '/admin/dashboard';
      case 'STAFF':
        return '/staff/dashboard';
      case 'STUDENT':
        return '/student/dashboard';
      case 'PARENT':
        return '/parent/dashboard';
      default:
        return '/';
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Top Breadcrumb & Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to={getDashboardPath()}
            className="p-2 rounded-full bg-white/80 border border-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-white shadow-2xs transition-all"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">PORTAL IDENTITY</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Verified Credentials
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              User Profile & Digital ID Badge
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleDownloadCard}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1e293b] text-white text-xs font-bold hover:bg-slate-800 shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Download Digital ID
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 3D Physics Lanyard Interactive Badge Canvas (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="relative bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 rounded-[32px] border border-slate-800 shadow-xl overflow-hidden p-2">
            {/* Top Interactive Ribbon & Instruction */}
            <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 backdrop-blur-md border border-slate-700/80 shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="text-[11px] font-semibold text-slate-200">3D Physics Lanyard</span>
              </div>
              <span className="text-[10px] font-medium text-slate-400 bg-slate-800/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-700/60 hidden sm:inline">
                Drag to swing • Click to flip
              </span>
            </div>

            {/* 3D Lanyard Viewport */}
            <div className="w-full h-[540px] sm:h-[600px] relative">
              <Lanyard
                frontImage={textures.frontImage}
                backImage={textures.backImage}
                strapImage={textures.strapImage}
                strapColor={textures.strapColor}
                cardColor="#ffffff"
                orientation="portrait"
                finish={finish}
                metal={metal}
                breeze={breeze}
                gravity={0.9}
                damping={0.45}
                elasticity={0.5}
                interactive={true}
                intro={true}
              />
            </div>

            {/* Bottom Floating Control Bar */}
            <div className="bg-slate-900/90 backdrop-blur-md rounded-[24px] border border-slate-800/90 p-3 mx-2 mb-2 flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-bold text-slate-300">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  Badge Surface Finish:
                </span>
                <span className="text-[11px] text-slate-400 uppercase font-semibold">{finish}</span>
              </div>

              {/* Finish Options Pill Group */}
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'holographic', label: 'Holo ✨' },
                  { id: 'glossy', label: 'Glossy' },
                  { id: 'metallic', label: 'Metallic' },
                  { id: 'matte', label: 'Matte' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setFinish(item.id)}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all ${
                      finish === item.id
                        ? 'bg-cyan-500 text-slate-950 shadow-xs'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Metal Clip & Breeze Controls */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">Clip Metal:</span>
                  {['silver', 'gold', 'graphite'].map((m) => (
                    <button
                      key={m}
                      onClick={() => setMetal(m)}
                      className={`px-2 py-0.5 rounded-md font-semibold capitalize ${
                        metal === m ? 'bg-slate-700 text-amber-400 ring-1 ring-amber-400/50' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">Wind:</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={breeze}
                    onChange={(e) => setBreeze(parseFloat(e.target.value))}
                    className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Academic Profile Information (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* User Hero Identity Card */}
          <div className="bg-white/90 backdrop-blur-md rounded-[32px] p-6 border border-slate-200/90 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center text-2xl font-black shadow-md">
                  {user?.full_name ? user.full_name[0] : (user?.username ? user.username[0].toUpperCase() : 'U')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                      {user?.full_name || user?.username}
                    </h2>
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  </div>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">
                    {user?.email || `${user?.username || 'user'}@college.edu`}
                  </p>
                </div>
              </div>

              {/* Role Badge */}
              <div className={`self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-gradient-to-r ${roleColors[role] || 'from-slate-700 to-slate-900 text-white'} border text-xs font-extrabold tracking-wide uppercase shadow-xs`}>
                {roleLabels[role] || role}
              </div>
            </div>

            {/* Profile Meta Cards Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 block uppercase">Account Role</span>
                <span className="text-sm font-bold text-slate-800 mt-0.5 block">{role}</span>
              </div>
              <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 block uppercase">Session</span>
                <span className="text-sm font-bold text-slate-800 mt-0.5 block">2025 - 2026</span>
              </div>
              <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 block uppercase">Authentication</span>
                <span className="text-sm font-bold text-emerald-700 mt-0.5 block">Active Token</span>
              </div>
              <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 block uppercase">ID Status</span>
                <span className="text-sm font-bold text-indigo-700 mt-0.5 block">COE Verified</span>
              </div>
            </div>
          </div>

          {/* Academic & Placement Details */}
          <div className="bg-white/90 backdrop-blur-md rounded-[32px] p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary-600" />
                Institutional Affiliation & Records
              </h3>
              <span className="text-xs font-semibold text-slate-400">Department Registry</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
                <User className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-400 block">Username Identifier</span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block font-mono">{user?.username}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
                <Mail className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-400 block">Institutional Email</span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block">{user?.email || `${user?.username}@college.edu`}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
                <Phone className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-400 block">Contact Telephone</span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block">{user?.phone_number || '+91 98765 43210'}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
                <Building className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-400 block">Assigned Department</span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                    {user?.staff?.department || user?.student?.department || 'Computer Science & Engineering'}
                  </span>
                </div>
              </div>

              {/* Role specific fields */}
              {role === 'STUDENT' && (
                <>
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
                    <GraduationCap className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-400 block">Registration Number</span>
                      <span className="font-bold text-cyan-900 text-sm mt-0.5 block font-mono">
                        {user?.student?.reg_no || '21CS001'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
                    <Calendar className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-400 block">Semester & Section</span>
                      <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                        Semester {user?.student?.semester || 5} • Section {user?.student?.section || 'A'}
                      </span>
                    </div>
                  </div>
                </>
              )}

              {role === 'STAFF' && (
                <>
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
                    <Award className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-400 block">Academic Designation</span>
                      <span className="font-bold text-indigo-900 text-sm mt-0.5 block">
                        {user?.staff?.designation || 'Senior Assistant Professor'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
                    <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-400 block">Staff Employee ID</span>
                      <span className="font-bold text-slate-800 text-sm mt-0.5 block font-mono">
                        FAC-2025-0{user?.id || 2}
                      </span>
                    </div>
                  </div>
                </>
              )}

              {role === 'ADMIN' && (
                <>
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
                    <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-400 block">Administrative Tier</span>
                      <span className="font-bold text-amber-900 text-sm mt-0.5 block">
                        Super Administrator (Full System Grant)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
                    <Layers className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-400 block">Security Key Status</span>
                      <span className="font-bold text-emerald-700 text-sm mt-0.5 block">
                        Active RSA Credentials
                      </span>
                    </div>
                  </div>
                </>
              )}

              {role === 'PARENT' && (
                <>
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-400 block">Guardian Council ID</span>
                      <span className="font-bold text-emerald-900 text-sm mt-0.5 block font-mono">
                        PAR-2025-0{user?.id || 4}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
                    <GraduationCap className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-400 block">Authorized Student Ward</span>
                      <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                        Ayaan Khan (21CS001)
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Security & Official COE Credential Statement */}
          <div className="bg-gradient-to-r from-slate-900 to-[#1e293b] rounded-[32px] p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Controller of Examinations (COE) Authenticated
                </span>
              </div>
              <p className="text-xs text-slate-300 max-w-md">
                This digital card badge is valid for semester registrations, laboratory clearance, and identity verification across all campus portals.
              </p>
            </div>

            <Link
              to="/results"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all shrink-0 self-start sm:self-auto"
            >
              <span>COE Results Integration</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
