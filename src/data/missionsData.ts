import { MissionDefinition } from '../types';

export const ZONE_1_MISSIONS: MissionDefinition[] = [
  // =========================================================================
  // LEVEL 1: HALLU-BOT Basics (Bloom Level 2-3)
  // Theme: False claims & Hallucination detection
  // =========================================================================
  {
    id: 'mission-1-1',
    zoneId: 1,
    zoneName: 'Zone 1: Hallucination Hub',
    title: 'Level 1: HALLU-BOT Basics',
    subtitle: 'Misteri Data Populasi Jakarta & Halusinasi AI',
    difficulty: 2,
    bloomLevel: 'Bloom Level 2-3 (Pemahaman & Penerapan)',
    learningObjective: 'Memahami fenomena halusinasi AI, mengidentifikasi klaim palsu numerik, dan menerapkan tahap awal QUERY (Niyyah).',
    unlocked: true,
    unlockPuzzle: {
      phase: 'query',
      title: 'Membuka Level 1: Kuasai Tahap QUERY (Kueri)',
      conceptName: 'QUERY (Kueri) - Menanyakan Tujuan & Konteks',
      bloomLevel: 'Bloom Level 2 (Understanding)',
      islamicConcept: 'Niyyah (Niat yang Lurus & Sadar Tujuan)',
      definition: 'QUERY (Kueri) adalah penilaian awal terhadap tujuan, niat, dan konteks dari keluaran AI sebelum merespons atau mempercayai data tersebut.',
      scenario: 'Kamu menemukan hasil teks AI: "Jakarta adalah ibu kota Indonesia dengan populasi 500 juta orang."',
      question: 'Sebelum memeriksa data benar atau salah, apa yang perlu kamu tanyakan LEBIH DULU?',
      options: [
        {
          id: 'opt_a',
          text: 'Apakah saya perlu langsung menyebarkan informasi ini ke teman-teman?',
          isCorrect: false,
          explanation: 'Keliru. Menyebarkan informasi tanpa telaah awal melanggar adab verifikasi.'
        },
        {
          id: 'opt_b',
          text: 'Apakah klaim ini dari sumber resmi?',
          isCorrect: false,
          explanation: 'Ini adalah tahap EXAMINE (verifikasi sumber), bukan langkah QUERY pertama.'
        },
        {
          id: 'opt_c',
          text: 'Siapa yang membuat AI ini? Apa konteks dan tujuannya?',
          isCorrect: true,
          explanation: 'Benar sekali! QUERY adalah menanyakan tujuan dan konteks PERTAMA KALI. Ini adalah tahap NIYYAH (niat) dalam Digital Adab.'
        },
        {
          id: 'opt_d',
          text: 'Apakah saya langsung percaya pada informasi ini?',
          isCorrect: false,
          explanation: 'Kurang tepat. Percaya buta tanpa menanyakan konteks membuka celah tertipu disinformasi.'
        }
      ],
      hint: 'Query berarti "menanyakan". Pikirkan pertanyaan awal tentang pembuat dan tujuan sebelum mengecek angka.',
      successMessage: 'Luar biasa! Kamu memahami prinsip NIYYAH dalam Digital Adab. Level 1 kini terbuka!'
    },
    questData: {
      query: {
        npcSpeaker: 'Mentor Tabayyun',
        scenario: 'Sebuah output AI di media sosial menulis: "Presiden Indonesia lahir di Jakarta pada tahun 1960." Kamu hendak menanggapi konten tersebut.',
        question: 'Apa yang perlu kamu tanyakan PERTAMA KALI sebelum mempercayai informasi ini?',
        options: [
          {
            id: 'a',
            text: 'Apakah tahun 1960 itu benar sesuai kalender?',
            isCorrect: false,
            explanation: 'Keliru. Mengecek kebenaran angka adalah tahap Uncover, bukan Query awal.'
          },
          {
            id: 'b',
            text: 'Apakah saya perlu langsung membagikannya ke teman-teman sekelas?',
            isCorrect: false,
            explanation: 'Salah. Ini adalah tindakan di tahap Transform, bukan evaluasi Query.'
          },
          {
            id: 'c',
            text: 'Siapa pembuat AI ini, dan apakah ada kepentingan tertentu di balik klaim ini?',
            isCorrect: true,
            explanation: 'Tepat! Query adalah tahap pertama dimana kamu menanyakan KONTEKS dan TUJUAN. Ini mencerminkan prinsip NIYYAH dalam Digital Adab.'
          },
          {
            id: 'd',
            text: 'Di mana saya bisa menemukan bukti dari sumber lain?',
            isCorrect: false,
            explanation: 'Kurang tepat. Mencari rujukan eksternal adalah tahap Examine.'
          }
        ],
        hint: 'Ingat urutan QUEST: Q = Tanya tujuan/konteks, U = Ungkap kesalahan, E = Evaluasi sumber.'
      },
      uncover: {
        prompt: 'Output AI menampilkan 3 pernyataan tentang Jakarta. Pilih pernyataan yang PALING MENCURIGAKAN dan butuh pembuktian:',
        cards: [
          {
            id: 'c1',
            title: 'Pernyataan 1',
            text: 'Jakarta terletak di bagian barat laut Pulau Jawa.',
            isSuspicious: false,
            explanation: 'Fakta geografis benar dan akurat.'
          },
          {
            id: 'c2',
            title: 'Pernyataan 2',
            text: 'Jakarta merupakan pusat kegiatan ekonomi metropolitan di Indonesia.',
            isSuspicious: false,
            explanation: 'Fakta benar sesuai status perkembangan ekonomi kota.'
          },
          {
            id: 'c3',
            title: 'Pernyataan 3',
            text: 'Populasi penduduk kota Jakarta adalah 500 juta jiwa.',
            isSuspicious: true,
            explanation: 'SANGAT MENCURIGAKAN! Seluruh penduduk Indonesia saja sekitar 280 juta. Angka 500 juta untuk satu kota adalah kemustahilan halusinasi AI!'
          }
        ],
        hint: 'Bandingkan dengan total penduduk satu negara Indonesia yang hanya sekitar 280 juta jiwa.'
      },
      examine: {
        prompt: 'Untuk memverifikasi jumlah penduduk Jakarta yang sebenarnya, mana sumber yang PALING TERPERCAYA (Otoritatif)?',
        sources: [
          {
            id: 's1',
            title: 'Wikipedia Terbuka',
            type: 'Crowdsourced',
            icon: 'Globe',
            description: 'Ensiklopedia komunitas online yang dapat diedit oleh siapa saja.',
            isMostReliable: false,
            explanation: 'Bisa jadi referensi awal, namun wajib merujuk ke data primer resmi sensus negara.'
          },
          {
            id: 's2',
            title: 'Website Resmi BPS (Badan Pusat Statistik)',
            type: 'Lembaga Pemerintah Resmi',
            icon: 'BarChart2',
            description: 'Lembaga negara resmi yang memiliki metodologi sensus kependudukan nasional terakreditasi.',
            isMostReliable: true,
            explanation: 'SEMPURNA! BPS memiliki metodologi riset ketat, diaudit ahli, dan memiliki otoritas akuntabel resmi negara.'
          },
          {
            id: 's3',
            title: 'Akun Selebgram Medsos Viral',
            type: 'Influencer Media Sosial',
            icon: 'Smartphone',
            description: 'Postingan dengan 1 juta likes tanpa metodologi sensus teruji.',
            isMostReliable: false,
            explanation: 'Postingan medsos sering kali berupa opini atau sensasionalisme tanpa verifikasi.'
          },
          {
            id: 's4',
            title: 'Grup WhatsApp Obrolan Warga',
            type: 'Pesan Komunitas',
            icon: 'FileText',
            description: 'Pesan berantai cerita warga sekitar tanpa dokumen statistik.',
            isMostReliable: false,
            explanation: 'Cerita anekdotal tidak memenuhi standar verifikasi ilmiah.'
          }
        ],
        hint: 'Cari lembaga pemerintah non-kementerian resmi yang bertugas mendata sensus nasional.'
      },
      safeguard: {
        prompt: 'Pilihan etika perlindungan privasi dan integritas (Wara\' & Muraqabah):',
        items: [
          {
            id: 'sg1',
            statement: 'Sebelum memakai informasi AI untuk tugas sekolah, saya wajib memeriksa silang ke data resmi BPS.',
            shouldBeEnabled: true,
            explanation: 'Benar! Memeriksa silang menjaga kejujuran akademik dan integritas diri.'
          },
          {
            id: 'sg2',
            statement: 'Menyebarkan tangkapan layar klaim keliru AI ke grup publik untuk mempermalukan pembuatnya.',
            shouldBeEnabled: false,
            explanation: 'Tepat untuk TIDAK mencentang! Mempermalukan dan menyebarkan tangkapan layar kesalahan justru dapat memperluas hoaks.'
          },
          {
            id: 'sg3',
            statement: 'Memberi tahu teman secara pribadi dengan menyertakan data resmi BPS yang benar.',
            shouldBeEnabled: true,
            explanation: 'Benar! Menjaga martabat teman dan meluruskan fakta dengan santun (prinsip Qoul Sadida).'
          }
        ]
      },
      transform: {
        prompt: 'Berdasarkan analisis QUEST, tindakan nyata apa yang paling bertanggung jawab dan dapat dicapai (Achievable)?',
        actions: [
          {
            id: 'a1',
            label: 'Melaporkan anomali data ke guru/admin dengan menyertakan bukti data resmi dari BPS.',
            isCorrect: true,
            explanation: 'Sempurna! Transform yang bertanggung jawab: melapor ke pihak berwenang dengan membawa bukti sumber terpercaya.'
          },
          {
            id: 'a2',
            label: 'Membagikan data salah tersebut ke media sosial agar menjadi perdebatan viral.',
            isCorrect: false,
            explanation: 'Keliru! Menjadikan hoaks bahan viralitas memperkeruh ruang informasi digital.'
          },
          {
            id: 'a3',
            label: 'Mengabaikan saja dan membiarkan orang lain terus percaya angka 500 juta.',
            isCorrect: false,
            explanation: 'Kurang tepat! Kita diajarkan untuk peduli dan berkhidmah menjaga kebaikan bersama.'
          }
        ]
      }
    },
    inGamePuzzles: [
      {
        id: 'p1',
        type: 'error_door',
        title: 'Gerbang Deteksi Halusinasi',
        instruction: 'Pilih klaim HALUSINASI yang mustahil untuk membuka gerbang laser!',
        xPosition: 520,
        solved: false,
        options: [
          { id: 'opt1', label: '1. Jakarta adalah kota metropolitan di Jawa', isCorrect: false, feedback: 'Klaim ini benar dan nyata.' },
          { id: 'opt2', label: '2. Jumlah penduduk Jakarta 500 juta jiwa', isCorrect: true, feedback: 'Tepat! 500 juta adalah halusinasi mustahil. Gerbang terbuka!' },
          { id: 'opt3', label: '3. Jakarta terletak di pesisir barat laut', isCorrect: false, feedback: 'Klaim ini akurat secara geografis.' },
        ]
      },
      {
        id: 'p2',
        type: 'source_bridge',
        title: 'Jembatan Verifikasi BPS',
        instruction: 'Pilih pilar lembaga negara berwenang untuk menyeberangi jurang data rusak!',
        xPosition: 1150,
        solved: false,
        options: [
          { id: 'opt1', label: 'Akun Gosip Anonim', isCorrect: false, feedback: 'Pilar rapuh! Gosip bukan rujukan statistik.' },
          { id: 'opt2', label: 'Badan Pusat Statistik (BPS) RI', isCorrect: true, feedback: 'Hebat! Data sensus resmi BPS mengangkat jembatan!' },
          { id: 'opt3', label: 'Rumor Grup Chat', isCorrect: false, feedback: 'Pilar runtuh!' }
        ]
      },
      {
        id: 'p3',
        type: 'privacy_corridor',
        title: 'Koridor Tameng Privasi',
        instruction: 'Pilih jalan yang melindungi data pribadi dari kebocoran digital!',
        xPosition: 1680,
        solved: false,
        options: [
          { id: 'opt1', label: 'Bagikan NIK dan Alamat Rumah ke AI Publik', isCorrect: false, feedback: 'Bahaya! Data pribadi tidak boleh diunggah sembarangan.' },
          { id: 'opt2', label: 'Gunakan Rujukan Statistik Publik Tanpa Data Pribadi', isCorrect: true, feedback: 'Luar biasa! Tameng privasi melindungimu melewati koridor!' }
        ]
      }
    ],
    boss: {
      name: 'HALLU-BOT 1.0',
      title: 'Mecha Distorsi Halusinasi AI (Orange/Red)',
      maxHp: 150,
      color: '#f97316',
      glitchLevel: 1,
      phases: [
        {
          phase: 1,
          hpThreshold: 100,
          projectileSpeed: 2.2,
          spawnInterval: 130,
          textClues: ['500 Juta Penduduk!', 'Halusinasi Data', 'Klaim Palsu']
        },
        {
          phase: 2,
          hpThreshold: 50,
          projectileSpeed: 3.2,
          spawnInterval: 95,
          textClues: ['Klaim Asal Tulis!', 'Tanpa Sensus!', 'Distorsi Numerik']
        },
        {
          phase: 3,
          hpThreshold: 0,
          projectileSpeed: 4.2,
          spawnInterval: 65,
          textClues: ['DATA BPS MENANG!', 'Halusinasi Ternetralkan!', 'Verifikasi Selesai!']
        }
      ]
    }
  },

  // =========================================================================
  // LEVEL 2: TIME-GLITCH Intermediate (Bloom Level 3-4)
  // Theme: Temporal Inconsistencies & Outdated Data
  // =========================================================================
  {
    id: 'mission-1-2',
    zoneId: 1,
    zoneName: 'Zone 1: Hallucination Hub',
    title: 'Level 2: TIME-GLITCH Intermediate',
    subtitle: 'Anomali Linimasa & Overgeneralisasi Sejarah',
    difficulty: 3,
    bloomLevel: 'Bloom Level 3-4 (Penerapan & Analisis)',
    learningObjective: 'Mengidentifikasi anakronisme waktu, klaim overgeneralisasi AI (seperti klaim 100% mutlak), dan menguji linimasa sejarah ke Arsip Nasional.',
    unlocked: false,
    unlockPuzzle: {
      phase: 'uncover',
      title: 'Membuka Level 2: Kuasai Tahap UNCOVER (Ungkap)',
      conceptName: 'UNCOVER (Ungkap) - Menemukan Anomali & Overclaim',
      bloomLevel: 'Bloom Level 4 (Analysis)',
      islamicConcept: 'Wara\' (Integritas & Ketelitian Observasi)',
      definition: 'UNCOVER (Ungkap) adalah mengidentifikasi kesalahan, anakronisme waktu, generalisasi berlebihan, atau klaim mencurigakan melalui observasi teliti.',
      scenario: 'AI memaparkan sejarah Indonesia:\n1. Indonesia merdeka pada tahun 1945.\n2. Presiden pertama adalah Ir. Soekarno.\n3. Indonesia adalah negara paling kaya di seluruh Asia Tenggara sejak merdeka.',
      question: 'Mana klaim yang PALING MENCURIGAKAN dan membutuhkan pembuktian mendalam?',
      options: [
        {
          id: 'opt_a',
          text: 'Pernyataan 1: Indonesia merdeka pada tahun 1945.',
          isCorrect: false,
          explanation: 'Ini adalah fakta sejarah resmi yang sudah teruji.'
        },
        {
          id: 'opt_b',
          text: 'Pernyataan 2: Presiden pertama adalah Ir. Soekarno.',
          isCorrect: false,
          explanation: 'Ini adalah fakta sejarah bangsa yang valid.'
        },
        {
          id: 'opt_c',
          text: 'Pernyataan 3: Klaim "paling kaya di seluruh Asia Tenggara".',
          isCorrect: true,
          explanation: 'Benar! Klaim "paling kaya" adalah generalisasi mencurigakan tanpa indikator metrik yang jelas (PDB per kapita atau total ekonomi). Ini membutuhkan observasi Wara\'!'
        },
        {
          id: 'opt_d',
          text: 'Semua klaim sama-sama mencurigakan.',
          isCorrect: false,
          explanation: 'Kurang tepat. Berpikir kritis memilah mana fakta terbukti dan mana klaim spekulatif.'
        }
      ],
      hint: 'Perhatikan klaim mutlak atau superlatif yang tidak menyertakan data ukuran ekonomi resmi.',
      successMessage: 'Hebat! Ketelitian observasi Wara\' membawamu membuka tantangan Level 2!'
    },
    questData: {
      query: {
        npcSpeaker: 'Guardian Wara\'',
        scenario: 'AI chatbot menyatakan: "Teknologi AI sekarang lebih pintar dari manusia dalam SEMUA hal dan akan menggantikan seluruh pekerjaan dalam 5 tahun."',
        question: 'Bagaimana kamu menilai niat dan konteks pernyataan AI ini?',
        options: [
          {
            id: 'a',
            text: 'Langsung percaya karena komputer memproses data sangat cepat.',
            isCorrect: false,
            explanation: 'Keliru. AI unggul di tugas spesifik namun tidak memiliki empati atau kesadaran moral.'
          },
          {
            id: 'b',
            text: 'Menganalisis tujuan: Apakah ini klaim sensasional untuk menarik perhatian publik (overhype)?',
            isCorrect: true,
            explanation: 'Sangat tepat! Menanyakan motif overhype di balik klaim adalah penerapan Query yang cerdas.'
          },
          {
            id: 'c',
            text: 'Menghapus aplikasi AI dari seluruh sekolah.',
            isCorrect: false,
            explanation: 'Tindakan reaktif tanpa analisis bertentangan dengan prinsip pembelajaran terarah.'
          },
          {
            id: 'd',
            text: 'Menyalin klaim tersebut ke status media sosial.',
            isCorrect: false,
            explanation: 'Menyebarkan klaim mutlak tanpa verifikasi memicu kecemasan yang tidak berdasar.'
          }
        ],
        hint: 'Tanyakan tujuan: Apakah pernyataan ini klaim objektif atau promosi sensasional yang berlebihan?'
      },
      uncover: {
        prompt: 'Temukan pernyataan linimasa internet Indonesia yang TIDAK MASUK AKAL dan melebih-lebihkan fakta:',
        cards: [
          {
            id: 'c1',
            title: 'Linimasa 1',
            text: 'Jaringan internet akademis pertama kali dirintis di Indonesia sekitar tahun 1980-an akhir.',
            isSuspicious: false,
            explanation: 'Fakta sejarah akurat (era Paguyuban Network/UI).'
          },
          {
            id: 'c2',
            title: 'Linimasa 2',
            text: 'Pada tahun 2000, pengguna internet Indonesia bertumbuh melampaui 1 juta pengguna.',
            isSuspicious: false,
            explanation: 'Sesuai dengan catatan pertumbuhan historis data APJII.'
          },
          {
            id: 'c3',
            title: 'Linimasa 3',
            text: 'Pada tahun 2020, 100% seluruh penduduk Indonesia tanpa kecuali telah memakai internet.',
            isSuspicious: true,
            explanation: 'OVERCLAIM MENCURIGAKAN! Data riil BPS/Kominfo mencatat penetrasi internet saat itu sekitar 73%, bukan 100% mutlak.'
          }
        ],
        hint: 'Perhatikan kata mutlak "100% tanpa kecuali" — Indonesia memiliki wilayah kepulauan luas dan daerah 3T yang masih bertahap pembangunannya.'
      },
      examine: {
        prompt: 'Untuk membuktikan fakta linimasa sejarah Proklamasi 1945, lembaga manakah yang memiliki arsip otentik tertinggi?',
        sources: [
          {
            id: 's1',
            title: 'Arsip Nasional Republik Indonesia (ANRI)',
            type: 'Lembaga Kearsipan Negara Resmi',
            icon: 'FileText',
            description: 'Lembaga resmi penyimpan naskah otentik, foto, dan rekaman asli Proklamasi 1945.',
            isMostReliable: true,
            explanation: 'TEPAT SEKALI! ANRI adalah rujukan primer sejarah nasional yang terverifikasi dan dilindungi undang-undang.'
          },
          {
            id: 's2',
            title: 'Video Rekayasa AI di Media Sosial',
            type: 'Media Sintetis',
            icon: 'Camera',
            description: 'Video animasi yang menggambarkan pahlawan memakai gawai modern.',
            isMostReliable: false,
            explanation: 'Video buatan AI adalah konten imajinatif buatan yang tidak memiliki nilai otentisitas arsip.'
          },
          {
            id: 's3',
            title: 'Utas Opini Tanpa Sumber Rujukan',
            type: 'Media Sosial',
            icon: 'Smartphone',
            description: 'Pendapat pribadi warganet tanpa mencantumkan rujukan pustaka.',
            isMostReliable: false,
            explanation: 'Opini warganet bukan rujukan ilmiah primer.'
          },
          {
            id: 's4',
            title: 'Komentar Forum Gaming',
            type: 'Forum Santai',
            icon: 'Gamepad2',
            description: 'Candaan gamer tentang linimasa fiktif.',
            isMostReliable: false,
            explanation: 'Bukan sumber ilmiah maupun sejarah terpercaya.'
          }
        ],
        hint: 'Pilihlah lembaga negara resmi penjaga arsip kemerdekaan Republik Indonesia.'
      },
      safeguard: {
        prompt: 'Sikap perlindungan terhadap integritas sejarah dan data masyarakat:',
        items: [
          {
            id: 'sg1',
            statement: 'Tidak mengubah naskah sejarah bangsa menjadi lelucon palsu yang dapat menyesatkan generasi berikutnya.',
            shouldBeEnabled: true,
            explanation: 'Benar! Menjaga fakta sejarah adalah wujud hormat kepada perjuangan para pendiri bangsa.'
          },
          {
            id: 'sg2',
            statement: 'Membiarkan konten sejarah palsu viral karena dianggap hanya hiburan lucu.',
            shouldBeEnabled: false,
            explanation: 'Tepat untuk TIDAK mencentang! Membiarkan konten anakronisme dapat mengikis pemahaman sejarah siswa.'
          },
          {
            id: 'sg3',
            statement: 'Melaporkan disinformasi sejarah kepada pembimbing dan meluruskan dengan dokumen ANRI.',
            shouldBeEnabled: true,
            explanation: 'Benar! Kolaborasi dengan guru menjaga keaslian literasi sejarah sekolah.'
          }
        ]
      },
      transform: {
        prompt: 'Aksi nyata untuk menyelesaikan distorsi waktu TIME-GLITCH:',
        actions: [
          {
            id: 'a1',
            label: 'Menyusun klarifikasi linimasa berbasis dokumen ANRI dan mengunggahnya ke mading literasi digital sekolah.',
            isCorrect: true,
            explanation: 'Luar biasa! Transformasi edukatif: menghadirkan bukti arsip terpercaya untuk mengedukasi sesama.'
          },
          {
            id: 'a2',
            label: 'Membalas akun pembuat disinformasi dengan kata-kata kasar dan hinaan.',
            isCorrect: false,
            explanation: 'Keliru! Adab komunikasi Islam (Qoul Sadida) mewajibkan tutur kata santun dan beradab.'
          },
          {
            id: 'a3',
            label: 'Menutup mata dan tidak peduli dengan pemahaman sejarah teman.',
            isCorrect: false,
            explanation: 'Salah! Kita dipanggil untuk senantiasa bermanfaat bagi sesama (Khidmah).'
          }
        ]
      }
    },
    inGamePuzzles: [
      {
        id: 'p1',
        type: 'error_door',
        title: 'Gerbang Linimasa Sejarah',
        instruction: 'Temukan anomali teknologi yang mustahil ada pada peristiwa 1945!',
        xPosition: 540,
        solved: false,
        options: [
          { id: 'opt1', label: '1. Naskah ketikan mesin tik Sayuti Melik', isCorrect: false, feedback: 'Mesin tik otentik ada pada tahun 1945.' },
          { id: 'opt2', label: '2. Siaran langsung smartphone viral di TikTok', isCorrect: true, feedback: 'Tepat! Smartphone belum ada pada 1945. Gerbang terbuka!' },
          { id: 'opt3', label: '3. Mikrofon corong radio bersejarah', isCorrect: false, feedback: 'Mikrofon corong memang ada pada era tersebut.' },
        ]
      },
      {
        id: 'p2',
        type: 'source_bridge',
        title: 'Jembatan Arsip Nasional (ANRI)',
        instruction: 'Lompat ke pilar lembaga arsip primer untuk melintasi jurang distorsi waktu!',
        xPosition: 1180,
        solved: false,
        options: [
          { id: 'opt1', label: 'Meme Komentar Tanpa Rujukan', isCorrect: false, feedback: 'Pilar runtuh! Meme bukan rujukan sejarah.' },
          { id: 'opt2', label: 'Arsip Nasional Republik Indonesia (ANRI)', isCorrect: true, feedback: 'Pilar kokoh! Arsip resmi membuka jembatan penyeberangan!' },
          { id: 'opt3', label: 'AI Video Deepfake Rekayasa', isCorrect: false, feedback: 'Pilar palsu roboh!' }
        ]
      },
      {
        id: 'p3',
        type: 'privacy_corridor',
        title: 'Jalur Kehormatan Sejarah',
        instruction: 'Pilih jalur integritas Wara\' dalam menyajikan data sejarah!',
        xPosition: 1720,
        solved: false,
        options: [
          { id: 'opt1', label: 'Menyalin Narasi Hoaks Tanpa Tabayyun', isCorrect: false, feedback: 'Terkena perangkap distorsi!' },
          { id: 'opt2', label: 'Verifikasi Linimasa Bersama Guru dan Arsip Resmi', isCorrect: true, feedback: 'Jalan bercahaya! Integritas membimbingmu lewat!' }
        ]
      }
    ],
    boss: {
      name: 'TIME-GLITCH 2.0',
      title: 'Mecha Manipulasi Linimasa Sejarah (Silver/Gray)',
      maxHp: 180,
      color: '#94a3b8',
      glitchLevel: 2,
      phases: [
        {
          phase: 1,
          hpThreshold: 120,
          projectileSpeed: 2.6,
          spawnInterval: 120,
          textClues: ['Smartphone 1945?!', 'Distorsi Waktu', 'Sejarah Palsu']
        },
        {
          phase: 2,
          hpThreshold: 60,
          projectileSpeed: 3.6,
          spawnInterval: 85,
          textClues: ['Kekacauan Linimasa!', 'Anakronisme!', 'Rekayasa Arsip']
        },
        {
          phase: 3,
          hpThreshold: 0,
          projectileSpeed: 4.6,
          spawnInterval: 60,
          textClues: ['ARSIP RESMI ANRI MENANG!', 'Linimasa Berhasil Pulih!', 'Glitch Terurai!']
        }
      ]
    }
  },

  // =========================================================================
  // LEVEL 3: FAKE-NEWS-REPLICATOR Hard (Bloom Level 4)
  // Theme: Misinformation multiplication & source credibility hierarchy
  // =========================================================================
  {
    id: 'mission-1-3',
    zoneId: 1,
    zoneName: 'Zone 1: Hallucination Hub',
    title: 'Level 3: FAKE-NEWS-REPLICATOR Hard',
    subtitle: 'Eksplosi Misinformasi & Hierarki Kredibilitas Sumber',
    difficulty: 4,
    bloomLevel: 'Bloom Level 4 (Analisis & Evaluasi Sumber)',
    learningObjective: 'Memahami hierarki otoritas sumber (Jurnal Peer-Review & Lembaga Resmi vs Influencer/Blog), menghentikan replikasi hoaks berantai.',
    unlocked: false,
    unlockPuzzle: {
      phase: 'examine',
      title: 'Membuka Level 3: Kuasai Tahap EXAMINE (Evaluasi)',
      conceptName: 'EXAMINE (Evaluasi) - Menilai Kredibilitas & Otoritas',
      bloomLevel: 'Bloom Level 4 (Analysis & Source Evaluation)',
      islamicConcept: 'Qoul (Komunikasi Beretika & Tabayyun)',
      definition: 'EXAMINE (Evaluasi) adalah memverifikasi klaim terhadap hierarki sumber yang terpercaya, menilai metodologi riset, kepakaran, serta potensi bias.',
      scenario: 'Kamu ingin memverifikasi efektivitas pola istirahat dan nutrisi bagi perkembangan otak anak usia 10-11 tahun.',
      question: 'Manakah urutan hierarki sumber dari yang PALING KREDIBEL hingga yang PALING BERISIKO?',
      options: [
        {
          id: 'opt_a',
          text: 'Video Viral YouTube > Postingan Blog Pribadi > Rekomendasi Dokter > Grup Chat',
          isCorrect: false,
          explanation: 'Keliru. Popularitas video atau jumlah penonton bukan bukti ketelitian ilmiah.'
        },
        {
          id: 'opt_b',
          text: 'Jurnal Medis Peer-Reviewed & Kemenkes RI > Dokter Spesialis > Media Populer > Blog Pribadi Tanpa Referensi',
          isCorrect: true,
          explanation: 'Benar sekali! Jurnal peer-reviewed dan lembaga kesehatan resmi memiliki akuntabilitas tertinggi karena melalui telaah pakar independen.'
        },
        {
          id: 'opt_c',
          text: 'Komentar Pengguna Medsos > Majalah Sekolah > Grup Chat > Website Pemerintah',
          isCorrect: false,
          explanation: 'Salah terbalik. Komentar warganet anonim memiliki risiko bias dan kesalahan tertinggi.'
        },
        {
          id: 'opt_d',
          text: 'Semua sumber memiliki kredibilitas yang sama asalkan menarik dibaca.',
          isCorrect: false,
          explanation: 'Keliru fatal. Setiap sumber memiliki tingkat otoritas, metodologi, dan akuntabilitas yang sangat berbeda.'
        }
      ],
      hint: 'Pilihlah urutan yang menempatkan penelitian peer-reviewed dan lembaga resmi kesehatan di posisi paling awal.'
      ,
      successMessage: 'Luar biasa! Pemahamanmu atas hierarki sumber Qoul membuka jalan menuju Level 3!'
    },
    questData: {
      query: {
        npcSpeaker: 'Master Qoul',
        scenario: 'Sebuah jaringan bot berita otomatis mereplikasi kabar heboh: "Minum ramuan garam mendidih dengan cabai menyembuhkan semua penyakit dalam 3 menit!" Puluhan situs tiruan membuat berita serupa.',
        question: 'Apa tujuan dan konteks yang kamu curigai dari kemunculan berita kloningan ini?',
        options: [
          {
            id: 'a',
            text: 'Ini pasti penemuan medis hebat karena ditulis oleh banyak website berbeda.',
            isCorrect: false,
            explanation: 'Keliru. Sindikat bot berita sering menyalin satu naskah palsu ke puluhan situs kloning demi memancing iklan.'
          },
          {
            id: 'b',
            text: 'Mencurigai motif clickbait komersial: menarik klik pengunjung dengan klaim ajaib yang berbahaya.',
            isCorrect: true,
            explanation: 'Tepat sekali! Memahami motif ekonomi/iklan di balik berita sensasional adalah langkah Query cerdas.'
          },
          {
            id: 'c',
            text: 'Menyuruh adik meminum ramuan itu untuk menguji khasiatnya.',
            isCorrect: false,
            explanation: 'SANGAT BERBAHAYA! Tindakan coba-coba obat membahayakan keselamatan jiwa.'
          },
          {
            id: 'd',
            text: 'Menyimpan artikel itu untuk dibaca lagi saat sakit.',
            isCorrect: false,
            explanation: 'Salah. Mempercayai resep berbahaya membahayakan diri sendiri.'
          }
        ],
        hint: 'Perhatikan kata "menyembuhkan semua penyakit dalam 3 menit" — klaim instan tanpa logika adalah ciri utama hoaks komersial.'
      },
      uncover: {
        prompt: 'Pilih klaim yang SANGAT BERBAHAYA dan tidak berdasar sains medis:',
        cards: [
          {
            id: 'c1',
            title: 'Klaim A (Sains Riil)',
            text: 'Minum air bersih dan istirahat cukup membantu sistem kekebalan tubuh memulihkan demam.',
            isSuspicious: false,
            explanation: 'Fakta medis teruji: hidrasi dan istirahat mendukung pemulihan biologis tubuh.'
          },
          {
            id: 'c2',
            title: 'Klaim B (Sains Riil)',
            text: 'Pemberian nutrisi bergizi seimbang meningkatkan daya tahan tubuh anak sekolah.',
            isSuspicious: false,
            explanation: 'Prinsip biologi dasar yang diakui seluruh dokter spesialis gizi anak.'
          },
          {
            id: 'c3',
            title: 'Klaim C (Bahaya Medis)',
            text: 'Minum air garam mendidih menyembuhkan semua ragam penyakit dalam 3 menit.',
            isSuspicious: true,
            explanation: 'KLAIM PALSU BERBAHAYA! Air mendidih merusak jaringan mulut dan lambung, serta konsentrasi garam berlebih merusak ginjal.'
          }
        ],
        hint: 'Cari klaim mustahil yang bertentangan dengan sains kesehatan dan membahayakan organ tubuh manusia.'
      },
      examine: {
        prompt: 'Untuk memverifikasi resep kesehatan yang aman bagi siswa, pihak manakah yang memiliki kompetensi tertinggi?',
        sources: [
          {
            id: 's1',
            title: 'Kementerian Kesehatan RI (Kemenkes) & Dokter Spesialis',
            type: 'Otoritas Kesehatan Resmi',
            icon: 'BarChart2',
            description: 'Lembaga kementerian kesehatan negara dan dokter bersertifikasi keilmuan medis.',
            isMostReliable: true,
            explanation: 'SEMPURNA! Rekomendasi kesehatan wajib bersumber dari tenaga medis terdaftar dan regulasi Kemenkes.'
          },
          {
            id: 's2',
            title: 'Pesan Berantai WhatsApp Berbintang Banyak',
            type: 'Pesan Diteruskan',
            icon: 'FileText',
            description: 'Teks yang diteruskan berkali-kali tanpa nama dokter penanggung jawab.',
            isMostReliable: false,
            explanation: 'Pesan berantai anonim sering kali disusupi mitos tanpa metodologi ilmiah.'
          },
          {
            id: 's3',
            title: 'Iklan Pop-up Game Ponsel',
            type: 'Iklan Promosi',
            icon: 'Gamepad2',
            description: 'Promosi suplemen dengan testimoni pemeran bayaran.',
            isMostReliable: false,
            explanation: 'Iklan berorientasi profit penjualan, bukan diagnosis klinis objektif.'
          },
          {
            id: 's4',
            title: 'Komentar Bot Spam di Medsos',
            type: 'Tautan Phishing',
            icon: 'AlertCircle',
            description: 'Komentar spam yang mengarahkan ke website perjudian atau penipuan.',
            isMostReliable: false,
            explanation: 'Berisiko malware dan pencurian data pribadi.'
          }
        ],
        hint: 'Pilihlah otoritas dokter resmi berlisensi dan Kementerian Kesehatan Republik Indonesia.'
      },
      safeguard: {
        prompt: 'Sikap etis mencegah penyebaran misinformasi berantai (Qoul Sadida):',
        items: [
          {
            id: 'sg1',
            statement: 'Tidak meneruskan (forward) pesan resep ajaib ke grup keluarga sebelum diverifikasi dokter.',
            shouldBeEnabled: true,
            explanation: 'Benar! Menahan jempol dari membagikan hoaks adalah benteng utama keselamatan keluarga.'
          },
          {
            id: 'sg2',
            statement: 'Menakut-nakuti teman dengan klaim bahwa resep palsu itu harus diminum agar tidak sakit.',
            shouldBeEnabled: false,
            explanation: 'Tepat untuk TIDAK mencentang! Menyesatkan kawan bertentangan dengan akhlak mulia.'
          },
          {
            id: 'sg3',
            statement: 'Memberi tahu guru UKS sekolah jika melihat ada kawan yang mencoba meminum ramuan berbahaya.',
            shouldBeEnabled: true,
            explanation: 'Benar! Menyelamatkan nyawa kawan adalah tanggung jawab moral tertinggi.'
          }
        ]
      },
      transform: {
        prompt: 'Tindakan transformatif untuk menghentikan replikasi misinformasi berantai:',
        actions: [
          {
            id: 'a1',
            label: 'Melaporkan tautan replikator berita palsu ke kanal aduan resmi pemerintah (aduankonten.id) dengan menyertakan rujukan Kemenkes.',
            isCorrect: true,
            explanation: 'Sempurna! Transformasi yang efektif: menggunakan kanal aduan resmi dengan bukti sains otentik.'
          },
          {
            id: 'a2',
            label: 'Membuat video parodi yang justru menyebarkan resep mendidih tersebut ke media sosial.',
            isCorrect: false,
            explanation: 'Keliru! Anak-anak lain bisa meniru resep berbahaya tersebut secara harfiah.'
          },
          {
            id: 'a3',
            label: 'Menghindari teman yang sedang sakit dan tidak peduli.',
            isCorrect: false,
            explanation: 'Salah! Kita diajarkan saling tolong-menolong dan menjaga sesama.'
          }
        ]
      }
    },
    inGamePuzzles: [
      {
        id: 'p1',
        type: 'error_door',
        title: 'Gerbang Deteksi Kloning Hoaks',
        instruction: 'Pilih narasi palsu yang sedang direplikasi oleh bot!',
        xPosition: 560,
        solved: false,
        options: [
          { id: 'opt1', label: '1. Air hangat bersih menjaga hidrasi saat sakit', isCorrect: false, feedback: 'Ini anjuran medis yang benar.' },
          { id: 'opt2', label: '2. Air garam mendidih cabai sembuhkan demam 3 menit', isCorrect: true, feedback: 'Benar! Ini resep beracun kloningan. Pintu terbuka!' },
          { id: 'opt3', label: '3. Beristirahat cukup memulihkan imun', isCorrect: false, feedback: 'Fakta sains akurat.' },
        ]
      },
      {
        id: 'p2',
        type: 'source_bridge',
        title: 'Jembatan Otoritas Medis',
        instruction: 'Lompat ke rujukan lembaga medis resmi!',
        xPosition: 1200,
        solved: false,
        options: [
          { id: 'opt1', label: 'Broadcast Anonim Berantai', isCorrect: false, feedback: 'Jatuh ke cairan uji coba palsu!' },
          { id: 'opt2', label: 'Kemenkes RI & Dokter Bersertifikasi', isCorrect: true, feedback: 'Jembatan sains berdiri kokoh menyeberangkanmu!' },
          { id: 'opt3', label: 'Testimoni Influencer Bayaran', isCorrect: false, feedback: 'Pilar komersial roboh!' }
        ]
      },
      {
        id: 'p3',
        type: 'privacy_corridor',
        title: 'Koridor Tameng Data Medis',
        instruction: 'Lindungi kerahasiaan data medis teman dari kebocoran!',
        xPosition: 1740,
        solved: false,
        options: [
          { id: 'opt1', label: 'Unggah Foto Rekam Medis Teman ke Publik', isCorrect: false, feedback: 'Alarm pelanggaran privasi menyala!' },
          { id: 'opt2', label: 'Jaga Kerahasiaan Rekam Medis Sesuai Adab', isCorrect: true, feedback: 'Sensor privasi hijau! Jalan terbuka aman!' }
        ]
      }
    ],
    boss: {
      name: 'REPLICATOR-BOT 3.0',
      title: 'Mecha Replikasi Misinformasi Berantai (Red/Pink)',
      maxHp: 210,
      color: '#f43f5e',
      glitchLevel: 3,
      phases: [
        {
          phase: 1,
          hpThreshold: 140,
          projectileSpeed: 2.8,
          spawnInterval: 110,
          textClues: ['Resep Mendidih!', 'Kloning Berita', 'Hoaks Viral']
        },
        {
          phase: 2,
          hpThreshold: 70,
          projectileSpeed: 3.8,
          spawnInterval: 80,
          textClues: ['Replikasi Berantai!', 'Clickbait Agresif!', 'Eksplosi Hoaks']
        },
        {
          phase: 3,
          hpThreshold: 0,
          projectileSpeed: 4.8,
          spawnInterval: 55,
          textClues: ['TABAYYUN QOUL MENANG!', 'Replikasi Terputus!', 'Ekosistem Informasi Bersih!']
        }
      ]
    }
  },

  // =========================================================================
  // LEVEL 4: CLAIM-DISTORTER Expert (Bloom Level 4-5)
  // Theme: Subtle distortions, misquotes & privacy impact
  // =========================================================================
  {
    id: 'mission-1-4',
    zoneId: 1,
    zoneName: 'Zone 1: Hallucination Hub',
    title: 'Level 4: CLAIM-DISTORTER Expert',
    subtitle: 'Distorsi Kutipan Halus & Penilaian Privasi (Safeguard)',
    difficulty: 5,
    bloomLevel: 'Bloom Level 4-5 (Evaluasi Etis & Penilaian Dampak)',
    learningObjective: 'Mendeteksi pemotongan kutipan di luar konteks (out-of-context), mengevaluasi dampak etis penyebaran data pribadi (UU PDP), dan menjaga adab Muraqabah.',
    unlocked: false,
    unlockPuzzle: {
      phase: 'safeguard',
      title: 'Membuka Level 4: Kuasai Tahap SAFEGUARD (Lindungi)',
      conceptName: 'SAFEGUARD (Lindungi) - Privasi & Konsekuensi Etis',
      bloomLevel: 'Bloom Level 5 (Evaluation & Ethical Reasoning)',
      islamicConcept: 'Muraqabah (Kesadaran Diri & Tanggung Jawab Moral)',
      definition: 'SAFEGUARD (Lindungi) adalah melindungi privasi orang lain, mempertimbangkan konsekuensi berantai dari setiap tindakan digital, dan mencegah perundungan siber.',
      scenario: 'Sebuah bot AI mengekspos daftar nama lengkap, nomor telepon, dan alamat rumah sejumlah siswa dengan tuduhan "akun yang pernah menyebarkan hoaks online". Beberapa teman ingin menyebarkannya kembali untuk "mempermalukan" mereka.',
      question: 'Dari sudut pandang SAFEGUARD dan adab Muraqabah, mengapa penyebaran ini HARUS DITOLAK?',
      options: [
        {
          id: 'opt_a',
          text: 'Karena data pribadi (nama, alamat, nomor telepon) dilindungi undang-undang dan mengeksposnya dapat memicu teror fisik dan bahaya nyata.',
          isCorrect: true,
          explanation: 'Tepat sekali! SAFEGUARD memprioritaskan perlindungan privasi, mitigasi bahaya fisik/mental, dan kepatuhan hukum perlindungan data pribadi (UU PDP).'
        },
        {
          id: 'opt_b',
          text: 'Karena kita hanya boleh mempercayai AI jika memiliki tanda centang biru.',
          isCorrect: false,
          explanation: 'Keliru. Ini tidak menjawab esensi perlindungan privasi dan dampak konsekuensi.'
        },
        {
          id: 'opt_c',
          text: 'Karena orang yang ada di daftar itu mungkin akan membalas dengan mengejek kita.',
          isCorrect: false,
          explanation: 'Kurang tepat. Alasan ini hanya kekhawatiran emosional pribadi, bukan penalaran etika perlindungan privasi bersama.'
        },
        {
          id: 'opt_d',
          text: 'Boleh disebarkan asalkan nomor teleponnya disamarkan sebagian.',
          isCorrect: false,
          explanation: 'Salah. Membagikan daftar perundungan tetap melanggar etika adab Muraqabah.'
        }
      ],
      hint: 'Pilihlah jawaban yang menegaskan perlindungan data pribadi dan pencegahan bahaya nyata bagi sesama.',
      successMessage: 'Luar biasa! Ketajaman etika Muraqabah membawamu membuka tantangan Level 4!'
    },
    questData: {
      query: {
        npcSpeaker: 'Elder Muraqabah',
        scenario: 'AI merilis ringkasan pidato kepala sekolah: "Kepala sekolah menyatakan bahwa kegiatan bermain game di akhir pekan harus dilarang total untuk seluruh anak." Namun dalam rekaman utuh, kepala sekolah berkata: "...jika tidak membagi waktu belajar, maka bermain game tanpa batas bisa merugikan."',
        question: 'Bagaimana kamu menilai niat di balik pemotongan konteks pidato tersebut?',
        options: [
          {
            id: 'a',
            text: 'Melihat bahwa kalimat dipotong sengaja untuk memancing kemarahan dan protes siswa kepada kepala sekolah.',
            isCorrect: true,
            explanation: 'Benar sekali! Memotong kalimat di luar konteks adalah taktik provokasi untuk mengadu domba warga sekolah.'
          },
          {
            id: 'b',
            text: 'Langsung membuat petisi mogok belajar tanpa mendengarkan rekaman asli pidato.',
            isCorrect: false,
            explanation: 'Keliru dan reaktif. Bertindak sebelum tabayyun merusak kerukunan sekolah.'
          },
          {
            id: 'c',
            text: 'Menyalahkan kepala sekolah karena memilih kata-kata yang rumit.',
            isCorrect: false,
            explanation: 'Kurang tepat. Masalah utamanya ada pada distorsi AI yang memenggal kalimat secara tidak adil.'
          },
          {
            id: 'd',
            text: 'Menganggap AI selalu benar meringkas pidato.',
            isCorrect: false,
            explanation: 'Salah. AI sering membuang nuansa penting dalam ringkasan otomatis.'
          }
        ],
        hint: 'Bandingkan kalimat asli yang lengkap dengan ringkasan sepihak yang menghilangkan syarat waktu.'
      },
      uncover: {
        prompt: 'Pilih contoh pemenggalan konteks (cherry-picking) yang paling merusak fakta kebenaran:',
        cards: [
          {
            id: 'c1',
            title: 'Kutipan A (Utuh & Adil)',
            text: '"Siswa boleh menggunakan AI untuk belajar, asalkan tidak mencontek saat ujian berlangsung."',
            isSuspicious: false,
            explanation: 'Kutipan utuh yang menjaga konteks arahan guru.'
          },
          {
            id: 'c2',
            title: 'Kutipan B (Utuh & Adil)',
            text: '"Teknologi digital membawa kemudahan besar, namun tetap menuntut adab dan integritas moral pengguna."',
            isSuspicious: false,
            explanation: 'Kutipan seimbang dan lengkap.'
          },
          {
            id: 'c3',
            title: 'Kutipan C (Distorsi Pemotongan)',
            text: '"Guru mengatakan: Siswa boleh mencontek saat ujian berlangsung!" (Kalimat depan sengaja dihilangkan).',
            isSuspicious: true,
            explanation: 'DISTORSI JAHAT! Memotong kata awal membalikkan makna 180 derajat menjadi fitnah dan kekacauan aturan!'
          }
        ],
        hint: 'Perhatikan bagaimana membuang syarat kalimat dapat membalikkan makna yang sebenarnya.'
      },
      examine: {
        prompt: 'Untuk membuktikan kutipan pidato yang dipotong, sumber verifikasi manakah yang PALING PRIMER?',
        sources: [
          {
            id: 's1',
            title: 'Rekaman Video & Transkrip Pidato Utuh Resmi Sekolah',
            type: 'Dokumen Primer Asli',
            icon: 'Camera',
            description: 'Dokumentasi utuh dari awal hingga akhir pidato yang tersimpan di arsip sekolah.',
            isMostReliable: true,
            explanation: 'SEMPURNA! Transkrip dan rekaman lengkap memperlihatkan konteks kalimat secara utuh tanpa potongan.'
          },
          {
            id: 's2',
            title: 'Tangkapan Layar Pesan Gosip Kelas',
            type: 'Media Sekunder Bias',
            icon: 'Smartphone',
            description: 'Potongan gambar chat berisi potongan kalimat sensasional.',
            isMostReliable: false,
            explanation: 'Tangkapan layar mudah direkayasa dan sering kali tidak lengkap.'
          },
          {
            id: 's3',
            title: 'Ringkasan Bot AI Baru Lainnya',
            type: 'Generatif Sintetis',
            icon: 'Bot',
            description: 'Meminta AI lain meraba apa maksud pidato tersebut.',
            isMostReliable: false,
            explanation: 'AI kedua tetap tidak memiliki rekaman fakta primer.'
          },
          {
            id: 's4',
            title: 'Desas-desus di Kantin Sekolah',
            type: 'Anekdotal',
            icon: 'FileText',
            description: 'Cerita dari mulut ke mulut yang sudah ditambahi bumbu gosip.',
            isMostReliable: false,
            explanation: 'Cerita mulut ke mulut adalah sumber paling rentan distorsi.'
          }
        ],
        hint: 'Pilihlah rekaman utuh dan transkrip asli yang didokumentasikan resmi oleh pihak sekolah.'
      },
      safeguard: {
        prompt: 'Evaluasi perlindungan privasi dan dampak konsekuensi (Muraqabah):',
        items: [
          {
            id: 'sg1',
            statement: 'Tidak menyebarkan data pribadi kawan (nama, nomor telepon, foto rumah) meskipun mereka dituduh berbuat salah.',
            shouldBeEnabled: true,
            explanation: 'Benar! Menjaga privasi orang lain mencegah ancaman kejahatan nyata dan perundungan siber.'
          },
          {
            id: 'sg2',
            statement: 'Membagikan potongan kutipan kontroversial agar guru mendapat kecaman dari warganet.',
            shouldBeEnabled: false,
            explanation: 'Tepat untuk TIDAK mencentang! Tindakan provokatif melanggar adab kesantunan dan kejujuran.'
          },
          {
            id: 'sg3',
            statement: 'Mengingatkan teman bahwa menyebarkan potongan fitnah di internet terekam dalam jejak digital dan pertanggungjawaban di hadapan Allah SWT.',
            shouldBeEnabled: true,
            explanation: 'Benar! Kesadaran Muraqabah mengingatkan bahwa setiap ketukan jemari kita diawasi oleh Sang Maha Pencipta.'
          }
        ]
      },
      transform: {
        prompt: 'Tindakan transformasi yang etis dan bijaksana:',
        actions: [
          {
            id: 'a1',
            label: 'Membagikan video dan transkrip rekaman utuh kepada ketua kelas dan dewan guru untuk memulihkan konteks pidato yang sebenarnya.',
            isCorrect: true,
            explanation: 'Luar biasa! Transformasi yang menenangkan suasana: menghadirkan konteks utuh sehingga fitnah terurai damai.'
          },
          {
            id: 'a2',
            label: 'Membuat akun anonim baru untuk menyerang pembuat distorsi kutipan tersebut.',
            isCorrect: false,
            explanation: 'Keliru! Membalas fitnah dengan serangan anonim hanya menambah racun di ruang siber.'
          },
          {
            id: 'a3',
            label: 'Menghapus rekaman utuh dan membiarkan fitnah berlanjut.',
            isCorrect: false,
            explanation: 'Salah! Menyembunyikan kebenaran bertentangan dengan prinsip kejujuran.'
          }
        ]
      }
    },
    inGamePuzzles: [
      {
        id: 'p1',
        type: 'error_door',
        title: 'Gerbang Dekoder Konteks',
        instruction: 'Pilih potongan kutipan yang telah diubah maknanya secara manipulatif!',
        xPosition: 550,
        solved: false,
        options: [
          { id: 'opt1', label: '1. Kutipan utuh lengkap dengan syarat waktu', isCorrect: false, feedback: 'Ini kutipan jujur berkonteks.' },
          { id: 'opt2', label: '2. Kutipan sengaja dipenggal separuh sehingga membalikkan arti', isCorrect: true, feedback: 'Tepat! Ini distorsi cherry-picking. Gerbang terbuka!' },
          { id: 'opt3', label: '3. Pernyataan netral sesuai data sensus', isCorrect: false, feedback: 'Ini fakta wajar.' },
        ]
      },
      {
        id: 'p2',
        type: 'source_bridge',
        title: 'Jembatan Rekaman Primer',
        instruction: 'Lompat ke rujukan dokumentasi primer utuh!',
        xPosition: 1190,
        solved: false,
        options: [
          { id: 'opt1', label: 'Tangkapan Layar Gosip Viral', isCorrect: false, feedback: 'Pilar runtuh! Screenshot dapat dipotong rekayasa.' },
          { id: 'opt2', label: 'Rekaman Video Asli Berdurasi Penuh', isCorrect: true, feedback: 'Pilar kokoh! Fakta utuh membentangkan jembatan penyeberangan!' },
          { id: 'opt3', label: 'Tebakan Bot AI Tanpa Data', isCorrect: false, feedback: 'Pilar rapuh runtuh!' }
        ]
      },
      {
        id: 'p3',
        type: 'privacy_corridor',
        title: 'Koridor Regulasi Privasi UU PDP',
        instruction: 'Lalui jalur yang melindungi privasi dan integritas sesama!',
        xPosition: 1730,
        solved: false,
        options: [
          { id: 'opt1', label: 'Doxxing: Bocorkan Alamat Rumah dan Data Keluarga', isCorrect: false, feedback: 'Alarm pelanggaran hukum privasi menyala merah!' },
          { id: 'opt2', label: 'Tegakkan UU Perlindungan Data Pribadi & Adab Muraqabah', isCorrect: true, feedback: 'Lolos dengan aman! Jalan terbuka bercahaya hijau!' }
        ]
      }
    ],
    boss: {
      name: 'DISTORTION-TITAN 4.0',
      title: 'Mecha Distorsi Konteks & Pelanggaran Privasi (Purple/Cyan)',
      maxHp: 240,
      color: '#a855f7',
      glitchLevel: 4,
      phases: [
        {
          phase: 1,
          hpThreshold: 160,
          projectileSpeed: 3.0,
          spawnInterval: 100,
          textClues: ['Kutipan Terpotong!', 'Distorsi Makna', 'Fitnah Konteks']
        },
        {
          phase: 2,
          hpThreshold: 80,
          projectileSpeed: 4.0,
          spawnInterval: 75,
          textClues: ['Bocorkan Privasi?!', 'Provokasi Siber!', 'Out-of-Context!']
        },
        {
          phase: 3,
          hpThreshold: 0,
          projectileSpeed: 5.0,
          spawnInterval: 50,
          textClues: ['KONTEKS UTUH MENANG!', 'Privasi Terlindungi Sempurna!', 'Distorsi Terurai!']
        }
      ]
    }
  },

  // =========================================================================
  // LEVEL 5: CORRUPTION-NEXUS Master (Bloom Level 5-6, Final Boss)
  // Theme: Systemic Corruption, Synthesis & Sustainable Responsible Action
  // =========================================================================
  {
    id: 'mission-1-5',
    zoneId: 1,
    zoneName: 'Zone 1: Hallucination Hub',
    title: 'Level 5: CORRUPTION-NEXUS Master',
    subtitle: 'Sintesis Sistemik & Aksi Nyata Berkelanjutan (Transform)',
    difficulty: 5,
    bloomLevel: 'Bloom Level 5-6 (Evaluasi Sistemik, Sintesis & Khidmah)',
    learningObjective: 'Mengintegrasikan seluruh siklus QUEST (Query-Uncover-Examine-Safeguard-Transform), mengatasi bias algoritma sistemik, dan merumuskan aksi nyata bertanggung jawab bagi masyarakat.',
    unlocked: false,
    unlockPuzzle: {
      phase: 'transform',
      title: 'Membuka Level 5: Kuasai Tahap TRANSFORM (Ubah)',
      conceptName: 'TRANSFORM (Ubah) - Mengambil Tindakan Bertanggung Jawab',
      bloomLevel: 'Bloom Level 6 (Synthesis & Sustainable Action)',
      islamicConcept: 'Khidmah (Pelayanan Tulus) & Ijtihad (Kesungguhan Berpikir)',
      definition: 'TRANSFORM (Ubah) adalah mengambil tindakan nyata yang bertanggung jawab, dapat dicapai (achievable), melalui saluran otoritas resmi, serta berlandaskan bukti kuat demi kebaikan bersama.',
      scenario: 'Setelah penyelidikan mendalam, kamu menemukan sistem AI rekomendasi beasiswa sekolah memiliki bias diskriminatif karena dilatih menggunakan data lama tahun 1980 yang tidak adil bagi siswa tertentu.',
      question: 'Manakah AKSI TRANSFORMASI PALING ETIS, ACHIEVABLE, DAN BERBOBOT?',
      options: [
        {
          id: 'opt_a',
          text: 'Merusak server sekolah di malam hari agar komputer mati total.',
          isCorrect: false,
          explanation: 'Tindakan anarki yang merusak fasilitas dan melanggar hukum.'
        },
        {
          id: 'opt_b',
          text: 'Menyusun laporan bukti audit bias algoritma, menyertakan data riset modern, dan mengajukannya kepada pihak sekolah/kementerian untuk perbaikan sistem AI.',
          isCorrect: true,
          explanation: 'Sempurna! Inilah puncak TRANSFORM: Terukur, bertanggung jawab, melalui jalur resmi, berlandaskan data otentik demi maslahat bersama (Khidmah & Ijtihad).'
        },
        {
          id: 'opt_c',
          text: 'Membuat akun media sosial untuk mengejek semua siswa yang menerima beasiswa.',
          isCorrect: false,
          explanation: 'Keliru dan menyakiti sesama. Mengabaikan adab komunikasi persaudaraan.'
        },
        {
          id: 'opt_d',
          text: 'Mendiamkan saja karena merasa diri kita masih anak-anak dan tidak berdaya.',
          isCorrect: false,
          explanation: 'Kurang tepat. Siswa dapat menyampaikan temuan dengan santun kepada pembimbing.'
        }
      ],
      hint: 'Pilihlah tindakan yang legal, dapat dicapai secara nyata, berorientasi solusi, dan membawa bukti kuat.'
      ,
      successMessage: 'Luar biasa! Kamu telah menguasai esensi KHIDMAH dan IJTIHAD. Gerbang Final Boss Level 5 TERBUKA!'
    },
    questData: {
      query: {
        npcSpeaker: 'Dewan Mentor QUEST Terpadu',
        scenario: 'Sistem rekomendasi jurusan otomatis berbasis AI di sekolah merekomendasikan seluruh siswa laki-laki ke bidang teknik mesin, dan seluruh siswa perempuan hanya ke bidang tata boga, mengabaikan minat dan bakat individu.',
        question: 'Bagaimana kamu menilai niat awal dan konteks pembuatan AI tersebut?',
        options: [
          {
            id: 'a',
            text: 'Menganalisis bahwa AI ini kemungkinan dilatih dengan dataset masa lalu yang sarat stereotip gender, bukan cerminan potensi manusia.',
            isCorrect: true,
            explanation: 'Tepat sekali! Membedah latar belakang data pelatihan adalah tingkat tertinggi dalam analisis Query.'
          },
          {
            id: 'b',
            text: 'Menganggap rekomendasi AI sudah pasti takdir masa depan yang tidak bisa diubah.',
            isCorrect: false,
            explanation: 'Keliru. Kecerdasan manusia dan potensi fitrah tidak boleh dibatasi oleh stereotip mesin.'
          },
          {
            id: 'c',
            text: 'Langsung percaya begitu saja tanpa menanyakan metodologi data latihnya.',
            isCorrect: false,
            explanation: 'Salah. Sikap kritis menuntut evaluasi terhadap landasan data AI.'
          },
          {
            id: 'd',
            text: 'Menyerah dan berhenti mengejar cita-cita pribadi.',
            isCorrect: false,
            explanation: 'Kurang tepat! Kita harus percaya diri mengembangkan potensi anugerah Ilahi.'
          }
        ],
        hint: 'Tanyakan: Dari manakah AI ini belajar? Apakah dari data stereotip kuno yang sudah tidak relevan?'
      },
      uncover: {
        prompt: 'Temukan anomali sistemik yang mencerminkan bias data diskriminatif:',
        cards: [
          {
            id: 'c1',
            title: 'Analisis Profil Siswa',
            text: 'Siti memiliki nilai olimpiade fisika 98 dan gemar robotika, namun AI tetap mengarahkannya ke jurusan di luar minatnya hanya karena jenis kelamin.',
            isSuspicious: true,
            explanation: 'BIAS SISTEMIK NYATA! Algoritma mengabaikan prestasi riil dan hanya mengacu pada stereotip gender sempit!'
          },
          {
            id: 'c2',
            title: 'Penilaian Bakat Mandiri',
            text: 'Siswa dinilai berdasarkan portofolio karya, minat nyata, dan nilai akademik terverifikasi.',
            isSuspicious: false,
            explanation: 'Metode penilaian yang adil dan obyektif.'
          },
          {
            id: 'c3',
            title: 'Konsultasi Guru BK',
            text: 'Guru BK berdialog dari hati ke hati dengan siswa dan orang tua untuk merencanakan masa depan.',
            isSuspicious: false,
            explanation: 'Pendekatan adab personal yang manusiawi dan bijaksana.'
          }
        ],
        hint: 'Perhatikan siswa berprestasi yang diabaikan nilainya hanya karena algoritma yang kaku.'
      },
      examine: {
        prompt: 'Untuk mereformasi sistem rekomendasi bakat ini, otoritas manakah yang paling kompeten diajak bermusyawarah?',
        sources: [
          {
            id: 's1',
            title: 'Dewan Guru, Psikolog Pendidikan Anak & Kemendikbudristek',
            type: 'Kolaborasi Pakar Resmi',
            icon: 'BarChart2',
            description: 'Pakar pendidikan dan kementerian pembuat kurikulum nasional yang berorientasi pada pengembangan talenta anak.',
            isMostReliable: true,
            explanation: 'SEMPURNA! Reformasi kurikulum dan teknologi membutuhkan kolaborasi pakar pedagogi, psikolog anak, dan otoritas resmi.'
          },
          {
            id: 's2',
            title: 'Akun Bot Ramalan di Media Sosial',
            type: 'Prediksi Semu',
            icon: 'Bot',
            description: 'Ramalan zodiak komputer tanpa metodologi psikometri.',
            isMostReliable: false,
            explanation: 'Bukan rujukan ilmiah terakreditasi.'
          },
          {
            id: 's3',
            title: 'Polling Instan di Story Instagram',
            type: 'Opini Santai',
            icon: 'Smartphone',
            description: 'Tebakan teman bermain tanpa dasar data evaluasi.',
            isMostReliable: false,
            explanation: 'Jajak pendapat medsos tidak memiliki validitas penilaian bakat.'
          },
          {
            id: 's4',
            title: 'Iklan Kursus Kilat Berbayar',
            type: 'Komersial',
            icon: 'Globe',
            description: 'Brosur bisnis yang mengklaim bisa menentukan masa depan dalam 1 jam.',
            isMostReliable: false,
            explanation: 'Brosur komersial mengutamakan target keuntungan finansial.'
          }
        ],
        hint: 'Pilihlah kolaborasi dewan guru sekolah, psikolog pendidikan anak, dan dinas pendidikan resmi.'
      },
      safeguard: {
        prompt: 'Perlindungan masa depan dan keadilan digital bagi seluruh angkatan siswa:',
        items: [
          {
            id: 'sg1',
            statement: 'Memastikan data bakat pribadi setiap siswa dijaga kerahasiaannya dan tidak dijual ke pihak ketiga komersial.',
            shouldBeEnabled: true,
            explanation: 'Benar! Data siswa adalah amanah yang wajib dijaga ketat kerahasiaannya.'
          },
          {
            id: 'sg2',
            statement: 'Membiarkan algoritma bias terus dipakai agar kita tidak repot mengadakan evaluasi sistem.',
            shouldBeEnabled: false,
            explanation: 'Tepat untuk TIDAK mencentang! Membiarkan ketidakadilan merugikan masa depan adik-adik kelas berikutnya.'
          },
          {
            id: 'sg3',
            statement: 'Menyadari bahwa setiap manusia diciptakan Allah SWT dengan fitrah dan potensi unik yang patut dihargai.',
            shouldBeEnabled: true,
            explanation: 'Benar! Menghargai kemuliaan potensi setiap hamba Allah adalah cerminan Digital Adab tertinggi.'
          }
        ]
      },
      transform: {
        prompt: 'Langkah paripurna TRANSFORM untuk menyelamatkan ekosistem digital sekolah:',
        actions: [
          {
            id: 'a1',
            label: 'Menyusun naskah rekomendasi perbaikan model AI dengan melatih ulang data berbasis portofolio adil, lalu menyerahkannya kepada dewan guru.',
            isCorrect: true,
            explanation: 'Luar biasa! Inilah puncak TRANSFORM: Memperbaiki sistem secara terstruktur dan menghadirkan solusi yang berkelanjutan demi kemaslahatan bersama.'
          },
          {
            id: 'a2',
            label: 'Memboikot seluruh pelajaran sekolah dan berhenti belajar sama sekali.',
            isCorrect: false,
            explanation: 'Keliru! Merugikan diri sendiri dan tidak menyelesaikan akar permasalahan algoritma.'
          },
          {
            id: 'a3',
            label: 'Membuat hoaks baru untuk menutupi kesalahan sistem AI tersebut.',
            isCorrect: false,
            explanation: 'Salah besar! Kebohongan tidak akan pernah bisa meluruskan kekeliruan.'
          }
        ]
      }
    },
    inGamePuzzles: [
      {
        id: 'p1',
        type: 'error_door',
        title: 'Gerbang Deteksi Bias Algoritma',
        instruction: 'Pilih bukti nyata bahwa algoritma membuat keputusan berdasarkan stereotip diskriminatif!',
        xPosition: 570,
        solved: false,
        options: [
          { id: 'opt1', label: '1. Evaluasi objektif berdasarkan nilai ujian dan karya', isCorrect: false, feedback: 'Ini metode penilaian yang adil.' },
          { id: 'opt2', label: '2. Pembatasan cita-cita siswa hanya karena label gender masa lalu', isCorrect: true, feedback: 'Tepat! Ini bukti bias algoritma sistemik. Gerbang dibuka!' },
          { id: 'opt3', label: '3. Konsultasi ramah dengan guru bimbingan konseling', isCorrect: false, feedback: 'Ini proses pendampingan yang baik.' },
        ]
      },
      {
        id: 'p2',
        type: 'source_bridge',
        title: 'Jembatan Kemendikbudristek & Dewan Guru',
        instruction: 'Lompat ke pilar kolaborasi pakar pendidikan resmi!',
        xPosition: 1220,
        solved: false,
        options: [
          { id: 'opt1', label: 'Kanal Ramalan Nasib Komersial', isCorrect: false, feedback: 'Pilar runtuh ke jurang kepalsuan!' },
          { id: 'opt2', label: 'Kemendikbudristek & Dewan Guru Sekolah', isCorrect: true, feedback: 'Pilar emas terbit! Jembatan kebijaksanaan membimbingmu!' },
          { id: 'opt3', label: 'Polling Iseng di Medsos', isCorrect: false, feedback: 'Pilar rapuh roboh!' }
        ]
      },
      {
        id: 'p3',
        type: 'privacy_corridor',
        title: 'Ruang Transformasi Paripurna (Khidmah)',
        instruction: 'Lalui jalur pelayanan tulus (Khidmah) demi keadilan seluruh siswa!',
        xPosition: 1760,
        solved: false,
        options: [
          { id: 'opt1', label: 'Egois: Peduli Diri Sendiri dan Abaikan Kawan', isCorrect: false, feedback: 'Pintu terkunci! Adab menuntut kepedulian bersama.' },
          { id: 'opt2', label: 'Khidmah: Perbaiki Sistem Demi Kebaikan Seluruh Generasi', isCorrect: true, feedback: 'Luar biasa! Cahaya Khidmah membimbingmu menuju arena Final Boss!' }
        ]
      }
    ],
    boss: {
      name: 'CORRUPTION-NEXUS PRIME',
      title: 'Final Boss: Monster Sintesis Distorsi Sistemik (Prismatic/Rainbow)',
      maxHp: 280,
      color: '#ec4899',
      glitchLevel: 5,
      phases: [
        {
          phase: 1,
          hpThreshold: 220,
          projectileSpeed: 3.2,
          spawnInterval: 95,
          textClues: ['Fase 1: Uji Query Niat!', 'Motif Tersembunyi', 'Konteks Bias']
        },
        {
          phase: 2,
          hpThreshold: 150,
          projectileSpeed: 4.0,
          spawnInterval: 75,
          textClues: ['Fase 2: Ungkap Anomali!', 'Overgeneralization', 'Anakronisme']
        },
        {
          phase: 3,
          hpThreshold: 80,
          projectileSpeed: 4.8,
          spawnInterval: 60,
          textClues: ['Fase 3: Buktikan Sumber!', 'Peer-Review Otoritas', 'Hierarki Data']
        },
        {
          phase: 4,
          hpThreshold: 0,
          projectileSpeed: 5.5,
          spawnInterval: 45,
          textClues: ['FASE FINAL: TRANSFORMASI KHIDMAH!', 'Seluruh QUEST Bersatu!', 'Sistem Digital Berhasil Diselamatkan!']
        }
      ]
    }
  }
];
