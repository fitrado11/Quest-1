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
        { id: 'opt_a', text: 'Apakah saya harus langsung menyebarkan kabar ke teman?',
          isCorrect: false,
          explanation: 'Keliru. Menyebarkan informasi tanpa telaah awal melanggar adab verifikasi.'
        },
        { id: 'opt_b', text: 'Apakah klaim ini berasal dari sumber data resmi?',
          isCorrect: false,
          explanation: 'Ini adalah tahap EXAMINE (verifikasi sumber), bukan langkah QUERY pertama.'
        },
        { id: 'opt_c', text: 'Siapa pembuat sistem dan apa tujuan informasi tersebut?',
          isCorrect: true,
          explanation: 'Benar sekali! QUERY adalah menanyakan tujuan dan konteks PERTAMA KALI. Ini adalah tahap NIYYAH (niat) dalam Digital Adab.'
        },
        { id: 'opt_d', text: 'Apakah saya perlu langsung percaya seluruh tulisan ini?',
          isCorrect: false,
          explanation: 'Kurang tepat. Percaya buta tanpa menanyakan konteks membuka celah tertipu disinformasi.'
        }
      ],
      hint: 'Query berarti "menanyakan". Pikirkan pertanyaan awal tentang pembuat dan tujuan sebelum mengecek angka.',
      successMessage: 'Luar biasa! Kamu memahami prinsip NIYYAH dalam Digital Adab. Level 1 kini terbuka!'
    },
    questData: {
      query: {
        npcSpeaker: 'Mentor Tabayyun (Didampingi Zaki & Aisyah)',
        learningGoal: 'Membuat pertanyaan yang jelas untuk mencari tahu tujuan dan pembuat informasi AI.',
        scaffolding: {
          modelExample: 'Contoh Zaki: "Sebelum percaya teks AI tentang populasi kota, aku bertanya dulu: Siapa yang membuat sistem ini dan untuk apa informasi ditulis?"',
          studentHint: 'Tanyakan tujuan dan pembuat informasi terlebih dahulu (Niat / Niyyah) sebelum tergesa-gesa membagikannya.',
        },
        scenario: 'Kamu sedang mengerjakan tugas IPAS kelas V tentang ibu kota Indonesia. Sebuah chatbot AI menjawab dengan sangat percaya diri: "Populasi penduduk Jakarta saat ini mencapai 500 juta jiwa."',
        question: 'Sebelum kamu mempercayai atau menyalin jawaban AI ini, apa pertanyaan yang PALING TEPAT kamu tanyakan LEBIH DULU?',
        options: [
          { id: 'a', text: 'Apakah saya harus langsung membagikan teks AI ini ke grup chat kelas?',
            isCorrect: false,
            explanation: 'Kurang tepat. Membagikan informasi sebelum diperiksa melanggar prinsip kehati-hatian (Wara\'). Tanyakan dulu tujuannya!'
          },
          { id: 'b', text: 'Apakah saya bisa langsung menyalin seluruh teks AI ke lembar tugasku?',
            isCorrect: false,
            explanation: 'Kurang tepat. Menyalin langsung tanpa memeriksa bukan sikap jujur (Digital Adab). Periksa dulu tujuan dan kebenarannya!'
          },
          { id: 'c', text: 'Siapa pembuat sistem AI ini dan dari mana sumber data yang digunakannya?',
            isCorrect: true,
            explanation: 'Pilihanmu sangat tepat! Tahap QUERY mengajarkan kita menanyakan TUJUAN dan SUMBER pembuat informasi (prinsip Niyyah). Jangan langsung percaya pada jawaban yang terdengar yakin!'
          },
          { id: 'd', text: 'Apakah warna huruf AI ini sudah bagus untuk dicetak?',
            isCorrect: false,
            explanation: 'Kurang tepat. Tampilan luar bukan hal utama. Yang terpenting adalah menanyakan maksud dan kebenaran isinya.'
          }
        ],
        hint: 'Ingat huruf Q = QUERY: buat pertanyaan yang jelas tentang siapa pembuat dan apa tujuan informasi tersebut.',
        verifiedSource: {
          institution: 'Badan Pusat Statistik (BPS) Republik Indonesia',
          title: 'Hasil Sensus Penduduk Indonesia & Statistik Kependudukan Provinsi DKI Jakarta',
          yearOrDate: '2023 / 2024',
          url: 'https://www.bps.go.id',
          note: 'Total penduduk seluruh Indonesia sekitar 280 juta jiwa; penduduk DKI Jakarta sekitar 10,6 juta jiwa.'
        }
      },
      uncover: {
        prompt: 'Chatbot AI memberikan 3 rangkuman tentang Jakarta untuk tugas kelompokmu. Baca dengan teliti dan pilih klaim yang PALING MERAGUKAN (kemungkinan halusinasi AI):',
        learningGoal: 'Menemukan bagian informasi atau klaim AI yang meragukan dan butuh diperiksa.',
        cards: [
          {
            id: 'c1',
            title: 'Klaim 1 (Geografi)',
            text: 'Jakarta terletak di bagian barat laut Pulau Jawa.',
            isSuspicious: false,
            explanation: 'Klaim ini benar sesuai peta resmi Indonesia dan pelajaran geografi SD.'
          },
          {
            id: 'c2',
            title: 'Klaim 2 (Perekonomian)',
            text: 'Jakarta merupakan salah satu pusat kegiatan ekonomi metropolitan di Indonesia.',
            isSuspicious: false,
            explanation: 'Klaim ini fakta nyata sesuai perkembangan kota metropolitan di Indonesia.'
          },
          {
            id: 'c3',
            title: 'Klaim 3 (Kependudukan)',
            text: 'Jumlah penduduk kota Jakarta saat ini telah mencapai 500 juta jiwa.',
            isSuspicious: true,
            explanation: 'Hebat, kamu jeli! Total seluruh penduduk satu negara Indonesia saja sekitar 280 juta jiwa. Angka 500 juta untuk satu kota adalah contoh nyata HALUSINASI AI (jawaban terdengar lancar tetapi keliru total).'
          }
        ],
        hint: 'Bandingkan angka klaim dengan total penduduk satu negara Indonesia (sekitar 280 juta jiwa).',
        verifiedSource: {
          institution: 'BPS RI - Sensus Penduduk',
          title: 'Data Agregat Kependudukan Nasional BPS RI',
          yearOrDate: '2024',
          url: 'https://www.bps.go.id',
          note: 'Data resmi: Jumlah penduduk DKI Jakarta tercatat sekitar 10,67 juta jiwa.'
        }
      },
      examine: {
        prompt: 'Untuk membuktikan jumlah penduduk Jakarta yang sebenarnya dengan rumus WHO – EVIDENCE – WHEN – WHY – ELSEWHERE, mana sumber yang PALING DAPAT DIPERCAYA?',
        learningGoal: 'Memeriksa apakah sumber informasi memiliki bukti resmi, penulis/lembaga yang jelas, dan dapat diverifikasi.',
        sources: [
          {
            id: 's1',
            title: 'Wikipedia Terbuka',
            type: 'Ensiklopedia Komunitas',
            icon: 'Globe',
            description: 'WHO: Komunitas internet terbuka • WHEN: Bisa disunting kapan saja • Mengapa perlu dicek: Bagus untuk bacaan awal, namun wajib merujuk ke data sensus resmi.',
            isMostReliable: false,
            explanation: 'Wikipedia dapat menjadi titik awal, tetapi karena dapat disunting siapa pun secara anonim, kamu tetap harus mengecek sumber primernya.',
            authorOrPublisher: 'Komunitas Pengguna Terbuka',
            date: 'Terakhir disunting baru-baru ini',
            evidenceSummary: 'Kumpulan kutipan dari berbagai kontributor',
            purpose: 'Referensi bacaan ensiklopedia umum',
            corroboration: 'Harus dicocokkan ke sumber sensus negara'
          },
          {
            id: 's2',
            title: 'Website Resmi BPS (Badan Pusat Statistik RI)',
            type: 'Lembaga Negara Resmi',
            icon: 'BarChart2',
            description: 'WHO: Badan Pusat Statistik RI (Lembaga Pemerintah Resmi) • EVIDENCE: Menggunakan metodologi sensus teruji • WHEN: Data diperbarui berkala • WHY: Menyajikan data resmi bagi bangsa.',
            isMostReliable: true,
            explanation: 'Pilihanmu sangat tepat! BPS adalah lembaga negara resmi yang memiliki metodologi sensus ketat, diaudit oleh para ahli statistik, dan akuntabel bagi seluruh rakyat Indonesia.',
            authorOrPublisher: 'Badan Pusat Statistik Republik Indonesia (BPS)',
            date: 'Rilis Resmi 2023/2024',
            evidenceSummary: 'Sensus Penduduk dan Survei Sosial Ekonomi Nasional (Susenas)',
            purpose: 'Penyediaan data statistik resmi negara yang akurat',
            corroboration: 'Didukung oleh Kementerian Dalam Negeri dan pemerintah provinsi',
            verifiedSource: {
              institution: 'Badan Pusat Statistik (BPS)',
              title: 'Portal Resmi Data Sensus Penduduk BPS RI',
              yearOrDate: '2024',
              url: 'https://www.bps.go.id'
            }
          },
          {
            id: 's3',
            title: 'Akun Selebgram Medsos Viral',
            type: 'Influencer Media Sosial',
            icon: 'Smartphone',
            description: 'WHO: Akun perorangan • EVIDENCE: Tanpa metode sensus • WHY: Mencari likes dan penonton.',
            isMostReliable: false,
            explanation: 'Postingan medsos sering kali mengejar viralitas dan hiburan, bukan ketepatan data ilmiah kependudukan.',
            authorOrPublisher: 'Kreator Konten Pribadi',
            date: 'Postingan kemarin',
            evidenceSummary: 'Tangkapan layar potongan chat tanpa data mentah',
            purpose: 'Hiburan dan keterlibatan penonton'
          },
          {
            id: 's4',
            title: 'Pesan Teruskan di Grup WhatsApp Warga',
            type: 'Pesan Berantai',
            icon: 'FileText',
            description: 'WHO: Anonim (tidak ada nama penulis) • EVIDENCE: Cerita dari mulut ke mulut tanpa dokumen statistik.',
            isMostReliable: false,
            explanation: 'Pesan berantai tanpa nama penulis dan tanpa dokumen bukti sangat berisiko memuat kabar bohong atau salah paham.',
            authorOrPublisher: 'Tidak Diketahui (Anonim)',
            date: 'Sering diteruskan',
            evidenceSummary: 'Cerita kabar burung',
            purpose: 'Penyebaran pesan santai komunitas'
          }
        ],
        hint: 'Gunakan prinsip WHO (Siapa pembuatnya?) & EVIDENCE (Apa buktinya?): Cari lembaga negara resmi non-kementerian yang bertugas menyelenggarakan sensus nasional.',
        verifiedSource: {
          institution: 'Badan Pusat Statistik RI',
          title: 'Indikator Kependudukan Indonesia',
          yearOrDate: '2024',
          url: 'https://www.bps.go.id'
        }
      },
      safeguard: {
        prompt: 'Gunakan panduan SAFEGUARD (People – Data – Ideas) sebelum kamu membagikan hasil tugasmu:',
        learningGoal: 'Memastikan informasi aman, tidak merugikan orang lain (People), menjaga data pribadi (Data), dan jujur tentang sumber/AI (Ideas).',
        items: [
          {
            id: 'sg1',
            category: 'ideas',
            statement: 'IDEAS: Memeriksa silang data tugas ke website resmi BPS dan mencantumkan BPS sebagai sumber rujukan.',
            shouldBeEnabled: true,
            explanation: 'Tepat sekali! Mencantumkan sumber resmi membuktikan kejujuran dan integritas belajarmu (Digital Adab Wara\').'
          },
          {
            id: 'sg2',
            category: 'people',
            statement: 'PEOPLE: Menyebarkan tangkapan layar kesalahan teman di grup chat publik untuk mempermalukan mereka.',
            shouldBeEnabled: false,
            explanation: 'Bagus, kamu tidak mencentang ini! Mempermalukan teman di media sosial melanggar adab (People: menghargai sesama). Kesalahan sebaiknya dibetulkan secara santun pribadi.'
          },
          {
            id: 'sg3',
            category: 'data',
            statement: 'DATA: Mengingatkan kawan agar tidak memasukkan alamat rumah, nomor HP, atau foto kartu pelajar saat memakai AI.',
            shouldBeEnabled: true,
            explanation: 'Tepat! Menjaga data sensitif agar tidak bocor ke internet adalah perlindungan diri dan kawan (Data Privacy).'
          }
        ],
        verifiedSource: {
          institution: 'Kementerian Komunikasi dan Informatika RI (Kominfo)',
          title: 'Pedoman Etika dan Perlindungan Data Pribadi untuk Remaja dan Pelajar',
          yearOrDate: '2023',
          url: 'https://kominfo.go.id'
        }
      },
      transform: {
        prompt: 'Gunakan prinsip READ → CLOSE → THINK → CREATE untuk membuat karya barumu yang bermanfaat:',
        learningGoal: 'Mengolah informasi yang sudah diverifikasi menjadi karya baru dengan pemahaman sendiri.',
        readCloseThinkPrompts: {
          step1Read: 'Baca data resmi: Penduduk Jakarta sekitar 10,6 juta jiwa (BPS 2024), bukan 500 juta jiwa.',
          step2Close: 'Tutup layarmu sejenak dan ingat inti pentingnya dengan kata-katamu sendiri.',
          step3ThinkQuestions: [
            'Mengapa AI bisa salah menyebut angka 500 juta?',
            'Apa dampak jika teman-teman sekelas mempercayai angka yang salah?',
            'Bagaimana cara menjelaskan data yang benar dengan santun?'
          ],
          step4CreateProducts: [
            'Poster infografis data BPS untuk majalah dinding sekolah',
            'Presentasi 2 slide perbandingan fakta vs halusinasi AI',
            'Catatan refleksi singkat kejujuran memakai AI'
          ]
        },
        actions: [
          {
            id: 'a1',
            label: 'Menyusun poster mading edukatif berisi data sensus BPS yang benar dan tips cek halusinasi AI',
            isCorrect: true,
            explanation: 'Sempurna! Inilah esensi TRANSFORM yang berfaedah (Khidmah): Mengubah hasil verifikasi menjadi karya nyata yang mengedukasi seluruh teman sekolah dengan bahasa sendiri.'
          },
          {
            id: 'a2',
            label: 'Menyalin mentah-mentah teks dari AI lalu mengakuinya sebagai hasil pemikiran sendiri tanpa menyebut sumber',
            isCorrect: false,
            explanation: 'Keliru! Mengakui hasil AI sebagai tulisan pribadi tanpa sumber adalah tindakan tidak jujur (plagiarisme).'
          },
          {
            id: 'a3',
            label: 'Membuat meme mengejek pembuat chatbot AI dan menyebarkannya agar viral di media sosial',
            isCorrect: false,
            explanation: 'Kurang tepat! Menebar ejekan tidak menyelesaikan masalah dan merusak etika kesopanan (Qoul Sadida).'
          }
        ],
        verifiedSource: {
          institution: 'Pusat Kurikulum dan Pembelajaran Kemendikbudristek',
          title: 'Panduan Pembelajaran Bermakna dan Literasi Digital Siswa Sekolah Dasar',
          yearOrDate: '2024',
          url: 'https://kurikulum.kemdikbud.go.id'
        }
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
          { id: 'opt1', label: '1. Jakarta adalah kota metropolitan di wilayah Jawa', isCorrect: false, feedback: 'Klaim ini benar dan nyata.' },
          { id: 'opt2', label: '2. Jumlah penduduk Jakarta mencapai lima ratus juta', isCorrect: true, feedback: 'Tepat! 500 juta adalah halusinasi mustahil. Gerbang terbuka!' },
          { id: 'opt3', label: '3. Jakarta berada di pesisir barat laut Jawa', isCorrect: false, feedback: 'Klaim ini akurat secara geografis.' },
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
          { id: 'opt1', label: 'Akun Gosip Anonim Media Sosial', isCorrect: false, feedback: 'Pilar rapuh! Gosip bukan rujukan statistik.' },
          { id: 'opt2', label: 'Badan Pusat Statistik Republik Indonesia', isCorrect: true, feedback: 'Hebat! Data sensus resmi BPS mengangkat jembatan!' },
          { id: 'opt3', label: 'Rumor Percakapan Grup Warga Sekitar', isCorrect: false, feedback: 'Pilar runtuh!' }
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
          { id: 'opt1', label: 'Kirimkan identitas pribadi seperti NIK ke AI', isCorrect: false, feedback: 'Bahaya! Data pribadi tidak boleh diunggah sembarangan.' },
          { id: 'opt2', label: 'Gunakan rujukan data terbuka tanpa identitas pribadi', isCorrect: true, feedback: 'Luar biasa! Tameng privasi melindungimu melewati koridor!' }
        ]
      }
    ],
    boss: {
      name: 'HALLU-BOT 1.0',
      title: 'Mecha Distorsi Halusinasi AI (Orange/Red)',
      maxHp: 300,
      color: '#f97316',
      glitchLevel: 1,
      phases: [
        {
          phase: 1,
          hpThreshold: 200,
          projectileSpeed: 2.2,
          spawnInterval: 130,
          textClues: ['500 Juta Penduduk!', 'Halusinasi Data', 'Klaim Palsu']
        },
        {
          phase: 2,
          hpThreshold: 100,
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
        { id: 'opt_a', text: 'Pernyataan satu bahwa Indonesia merdeka resmi pada tahun sembilanbelas empatlima',
          isCorrect: false,
          explanation: 'Ini adalah fakta sejarah resmi yang sudah teruji.'
        },
        { id: 'opt_b', text: 'Pernyataan dua bahwa presiden pertama Indonesia adalah insinyur soekarno pejuang',
          isCorrect: false,
          explanation: 'Ini adalah fakta sejarah bangsa yang valid.'
        },
        { id: 'opt_c', text: 'Pernyataan tiga bahwa Indonesia paling kaya di seluruh Asia Tenggara',
          isCorrect: true,
          explanation: 'Benar! Klaim "paling kaya" adalah generalisasi mencurigakan tanpa indikator metrik yang jelas (PDB per kapita atau total ekonomi). Ini membutuhkan observasi Wara\'!'
        },
        { id: 'opt_d', text: 'Pernyataan semua klaim di atas sama mencurigakan tanpa bukti jelas',
          isCorrect: false,
          explanation: 'Kurang tepat. Berpikir kritis memilah mana fakta terbukti dan mana klaim spekulatif.'
        }
      ],
      hint: 'Perhatikan klaim mutlak atau superlatif yang tidak menyertakan data ukuran ekonomi resmi.',
      successMessage: 'Hebat! Ketelitian observasi Wara\' membawamu membuka tantangan Level 2!'
    },
    questData: {
      query: {
        npcSpeaker: 'Guardian Wara\' (Didampingi Zaki & Aisyah)',
        learningGoal: 'Menentukan tujuan pencarian dan membuat pertanyaan jelas untuk mendeteksi klaim sensasional atau melebih-lebihkan fakta.',
        scaffolding: {
          modelExample: 'Contoh Aisyah: "Saat membaca klaim bahwa AI akan menggantikan semua pekerjaan manusia dalam 5 tahun, aku bertanya: Apakah klaim ini sekadar promosi sensasional, dan apa bukti ilmiahnya?"',
          studentHint: 'Tanyakan tujuan dan motif pembuat tulisan. Apakah ini fakta objektif atau sekadar mencari sensasi viral?'
        },
        scenario: 'AI chatbot menyatakan: "Teknologi AI sekarang lebih pintar dari manusia dalam SEMUA hal dan akan menggantikan seluruh pekerjaan dalam 5 tahun."',
        question: 'Bagaimana kamu menilai niat dan konteks pernyataan AI ini?',
        options: [
          { id: 'a', text: 'Percaya langsung sebab mesin komputer memproses sangat cepat',
            isCorrect: false,
            explanation: 'Keliru. AI unggul di tugas spesifik namun tidak memiliki empati atau kesadaran moral.'
          },
          { id: 'b', text: 'Menganalisis tujuan apakah klaim hanya demi sensasi berlebihan',
            isCorrect: true,
            explanation: 'Sangat tepat! Menanyakan motif overhype di balik klaim adalah penerapan Query yang cerdas.'
          },
          { id: 'c', text: 'Menghapus seluruh aplikasi teknologi kecerdasan buatan di sekolah',
            isCorrect: false,
            explanation: 'Tindakan reaktif tanpa analisis bertentangan dengan prinsip pembelajaran terarah.'
          },
          { id: 'd', text: 'Menyalin klaim mutlak tersebut ke status media sosial',
            isCorrect: false,
            explanation: 'Menyebarkan klaim mutlak tanpa verifikasi memicu kecemasan yang tidak berdasar.'
          }
        ],
        hint: 'Tanyakan tujuan: Apakah pernyataan ini klaim objektif atau promosi sensasional yang berlebihan?',
        verifiedSource: {
          institution: 'Badan Riset dan Inovasi Nasional (BRIN) & Kominfo',
          title: 'Strategi Nasional Kecerdasan Artifisial Republik Indonesia',
          yearOrDate: '2023',
          url: 'https://brin.go.id',
          note: 'AI dirancang sebagai alat bantu manusia, bukan pengganti mutlak nalar etis dan empati.'
        }
      },
      uncover: {
        prompt: 'Temukan pernyataan linimasa internet Indonesia yang TIDAK MASUK AKAL dan melebih-lebihkan fakta:',
        learningGoal: 'Menemukan klaim generalisasi berlebihan (overclaim) atau linimasa waktu yang tidak masuk akal.',
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
        learningGoal: 'Memeriksa bukti primer sejarah dan membandingkan keaslian naskah ke lembaga arsip resmi (ANRI).',
        sources: [
          {
            id: 's1',
            title: 'Arsip Nasional Republik Indonesia (ANRI)',
            type: 'Lembaga Kearsipan Negara Resmi',
            icon: 'FileText',
            description: 'WHO: Lembaga negara penyimpan arsip primer • EVIDENCE: Naskah otentik & rekaman asli 1945 • WHY: Menjaga memori kolektif bangsa.',
            isMostReliable: true,
            explanation: 'TEPAT SEKALI! ANRI adalah rujukan primer sejarah nasional yang terverifikasi dan dilindungi undang-undang.',
            authorOrPublisher: 'Arsip Nasional Republik Indonesia (ANRI)',
            date: 'Dokumen Otentik 17 Agustus 1945',
            evidenceSummary: 'Naskah Proklamasi ketikan Sayuti Melik & tulisan tangan Ir. Soekarno',
            purpose: 'Pelestarian arsip primer sejarah negara'
          },
          {
            id: 's2',
            title: 'Video Rekayasa AI di Media Sosial',
            type: 'Media Sintetis',
            icon: 'Camera',
            description: 'WHO: Akun kreator anonim • EVIDENCE: Animasi fiktif pahlawan ber-smartphone • WHY: Hiburan algoritma viral.',
            isMostReliable: false,
            explanation: 'Video buatan AI adalah konten imajinatif buatan yang tidak memiliki nilai otentisitas arsip.',
            authorOrPublisher: 'Kreator Medsos Anonim',
            date: 'Baru diunggah',
            evidenceSummary: 'Animasi digital hasil generator AI',
            purpose: 'Hiburan dan mengejar likes'
          },
          {
            id: 's3',
            title: 'Utas Opini Tanpa Sumber Rujukan',
            type: 'Media Sosial',
            icon: 'Smartphone',
            description: 'WHO: Warganet perorangan • EVIDENCE: Tanpa buku atau arsip pendukung • WHY: Opini pribadi.',
            isMostReliable: false,
            explanation: 'Opini warganet bukan rujukan ilmiah primer.',
            authorOrPublisher: 'Warganet Pengguna Medsos',
            date: 'Minggu ini',
            evidenceSummary: 'Klaim subjektif tanpa daftar pustaka',
            purpose: 'Berbagi pendapat pribadi'
          },
          {
            id: 's4',
            title: 'Komentar Forum Gaming',
            type: 'Forum Santai',
            icon: 'Gamepad2',
            description: 'WHO: Pemain game online • EVIDENCE: Candaan linimasa fiktif • WHY: Obrolan hiburan.',
            isMostReliable: false,
            explanation: 'Bukan sumber ilmiah maupun sejarah terpercaya.',
            authorOrPublisher: 'Anggota Forum Game',
            date: 'Kemarin',
            evidenceSummary: 'Obrolan santai antar pemain',
            purpose: 'Candaan komunitas'
          }
        ],
        hint: 'Gunakan prinsip WHO (Lembaga kearsipan resmi negara) & EVIDENCE (Naskah otentik Proklamasi 1945).',
        verifiedSource: {
          institution: 'Arsip Nasional Republik Indonesia (ANRI)',
          title: 'Khazanah Arsip Statis: Naskah Otentik Proklamasi Kemerdekaan RI 1945',
          yearOrDate: '1945 / 2024',
          url: 'https://anri.go.id',
          note: 'Naskah Proklamasi diketik oleh Sayuti Melik dengan tanda tangan Soekarno-Hatta atas nama bangsa Indonesia.'
        }
      },
      safeguard: {
        prompt: 'Sikap perlindungan terhadap integritas sejarah dan data masyarakat (People – Data – Ideas):',
        learningGoal: 'Menjaga integritas sejarah bangsa (Ideas), tidak mempermalukan orang (People), dan menjaga data pribadi (Data).',
        items: [
          {
            id: 'sg1',
            category: 'ideas',
            statement: 'IDEAS: Menjaga naskah sejarah bangsa tetap otentik dan tidak mengubahnya menjadi kabar bohong yang menyesatkan generasi mendatang.',
            shouldBeEnabled: true,
            explanation: 'Benar! Menjaga fakta sejarah adalah wujud hormat kepada perjuangan para pendiri bangsa.'
          },
          {
            id: 'sg2',
            category: 'people',
            statement: 'PEOPLE: Membiarkan konten sejarah palsu terus viral dan menertawakan teman yang tidak sengaja tertipu.',
            shouldBeEnabled: false,
            explanation: 'Tepat untuk TIDAK mencentang! Membiarkan hoaks dan mengejek kawan melanggar adab Digital.'
          },
          {
            id: 'sg3',
            category: 'data',
            statement: 'DATA: Tidak membagikan dokumen atau data pribadi kawan saat mengunggah laporan tugas sejarah di ruang digital terbuka.',
            shouldBeEnabled: true,
            explanation: 'Benar! Menjaga data pribadi di internet adalah kewajiban bersama.'
          }
        ],
        verifiedSource: {
          institution: 'Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi (Kemendikbudristek)',
          title: 'Panduan Penguatan Literasi Sejarah dan Karakter Pelajar Pancasila',
          yearOrDate: '2023',
          url: 'https://kemdikbud.go.id'
        }
      },
      transform: {
        prompt: 'Aksi nyata untuk menyelesaikan distorsi waktu TIME-GLITCH (READ → CLOSE → THINK → CREATE):',
        learningGoal: 'Membuat karya klarifikasi sejarah dengan pemahaman sendiri menggunakan prinsip READ → CLOSE → THINK → CREATE.',
        readCloseThinkPrompts: {
          step1Read: 'Baca arsip resmi ANRI: Naskah Proklamasi dibacakan 17 Agustus 1945 di Jalan Pegangsaan Timur No. 56 Jakarta.',
          step2Close: 'Tutup sumber dan renungkan intinya dengan bahasamu sendiri.',
          step3ThinkQuestions: [
            'Mengapa video AI yang menggambarkan pahlawan memakai smartphone bisa membingungkan adik kelas?',
            'Bagaimana cara membetulkan informasi tanpa mencaci orang yang membuat video?'
          ],
          step4CreateProducts: [
            'Infografis linimasa kemerdekaan 1945 untuk majalah dinding sekolah',
            'Presentasi kelompok membandingkan arsip asli ANRI vs video AI',
            'Ringkasan naskah proklamasi hasil pemahaman sendiri'
          ]
        },
        actions: [
          {
            id: 'a1',
            label: 'Menyusun klarifikasi linimasa dokumen resmi ANRI untuk mading sekolah menggunakan bahasa sendiri',
            isCorrect: true,
            explanation: 'Luar biasa! Transformasi edukatif: menghadirkan bukti arsip terpercaya untuk mengedukasi sesama.'
          },
          {
            id: 'a2',
            label: 'Membalas pembuat disinformasi dengan kata caci maki sangat kasar di kolom komentar',
            isCorrect: false,
            explanation: 'Keliru! Adab komunikasi Islam (Qoul Sadida) mewajibkan tutur kata santun dan beradab.'
          },
          {
            id: 'a3',
            label: 'Menutup mata tanpa peduli pemahaman sejarah kawan di kelas',
            isCorrect: false,
            explanation: 'Salah! Kita dipanggil untuk senantiasa bermanfaat bagi sesama (Khidmah).'
          }
        ],
        verifiedSource: {
          institution: 'Pusat Perbukuan Kemendikbudristek',
          title: 'Buku Siswa IPAS Kelas V: Harmoni dalam Ekosistem dan Sejarah Indonesia',
          yearOrDate: '2023',
          url: 'https://buku.kemdikbud.go.id'
        }
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
          { id: 'opt1', label: '1. Naskah mesin ketik Sayuti Melik', isCorrect: false, feedback: 'Mesin tik otentik ada pada tahun 1945.' },
          { id: 'opt2', label: '2. Siaran smartphone viral di TikTok', isCorrect: true, feedback: 'Tepat! Smartphone belum ada pada 1945. Gerbang terbuka!' },
          { id: 'opt3', label: '3. Mikrofon corong radio era kemerdekaan', isCorrect: false, feedback: 'Mikrofon corong memang ada pada era tersebut.' },
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
          { id: 'opt1', label: 'Meme Gambar Komentar Media Sosial', isCorrect: false, feedback: 'Pilar runtuh! Meme bukan rujukan sejarah.' },
          { id: 'opt2', label: 'Arsip Nasional Republik Indonesia ANRI', isCorrect: true, feedback: 'Pilar kokoh! Arsip resmi membuka jembatan penyeberangan!' },
          { id: 'opt3', label: 'Video Rekayasa Buatan Tiruan Komputer', isCorrect: false, feedback: 'Pilar palsu roboh!' }
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
          { id: 'opt1', label: 'Menyalin narasi hoaks tanpa tabayyun dokumen', isCorrect: false, feedback: 'Terkena perangkap distorsi!' },
          { id: 'opt2', label: 'Verifikasi linimasa bersama guru pembimbing sekolah', isCorrect: true, feedback: 'Jalan bercahaya! Integritas membimbingmu lewat!' }
        ]
      }
    ],
    boss: {
      name: 'TIME-GLITCH 2.0',
      title: 'Mecha Manipulasi Linimasa Sejarah (Silver/Gray)',
      maxHp: 360,
      color: '#94a3b8',
      glitchLevel: 2,
      phases: [
        {
          phase: 1,
          hpThreshold: 240,
          projectileSpeed: 2.6,
          spawnInterval: 120,
          textClues: ['Smartphone 1945?!', 'Distorsi Waktu', 'Sejarah Palsu']
        },
        {
          phase: 2,
          hpThreshold: 120,
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
        { id: 'opt_a', text: 'Video medsos lalu blog pribadi lalu rekomendasi dokter',
          isCorrect: false,
          explanation: 'Keliru. Popularitas video atau jumlah penonton bukan bukti ketelitian ilmiah.'
        },
        { id: 'opt_b', text: 'Jurnal medis resmi lalu dokter spesialis lalu blog',
          isCorrect: true,
          explanation: 'Benar sekali! Jurnal peer-reviewed dan lembaga kesehatan resmi memiliki akuntabilitas tertinggi karena melalui telaah pakar independen.'
        },
        { id: 'opt_c', text: 'Komentar anonim lalu majalah sekolah lalu situs kementerian',
          isCorrect: false,
          explanation: 'Salah terbalik. Komentar warganet anonim memiliki risiko bias dan kesalahan tertinggi.'
        },
        { id: 'opt_d', text: 'Semua sumber sama tingkat kredibilitas jika menarik dibaca',
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
        npcSpeaker: 'Master Qoul (Didampingi Zaki & Aisyah)',
        learningGoal: 'Menentukan tujuan pencarian dan mengenali motif ekonomi clickbait di balik berita heboh atau resep instan.',
        scaffolding: {
          modelExample: 'Contoh Zaki: "Ketika melihat artikel mengklaim resep ajaib sembuh 3 menit, aku bertanya: Siapa yang menulis dan apakah ini hanya trik clickbait demi meraup untung iklan?"',
          studentHint: 'Waspadai klaim instan tidak masuk akal. Tanyakan motif pembuat konten sebelum percaya.'
        },
        scenario: 'Sebuah jaringan bot berita otomatis mereplikasi kabar heboh: "Minum ramuan garam mendidih dengan cabai menyembuhkan semua penyakit dalam 3 menit!" Puluhan situs tiruan membuat berita serupa.',
        question: 'Apa tujuan dan konteks yang kamu curigai dari kemunculan berita kloningan ini?',
        options: [
          { id: 'a', text: 'Klaim hebat karena ditulis oleh banyak situs berbeda',
            isCorrect: false,
            explanation: 'Keliru. Sindikat bot berita sering menyalin satu naskah palsu ke puluhan situs kloning demi memancing iklan.'
          },
          { id: 'b', text: 'Mencurigai motif clickbait komersial demi keuntungan iklan digital',
            isCorrect: true,
            explanation: 'Tepat sekali! Memahami motif ekonomi/iklan di balik berita sensasional adalah langkah Query cerdas.'
          },
          { id: 'c', text: 'Menyuruh teman meminum ramuan untuk mencoba khasiat obat',
            isCorrect: false,
            explanation: 'SANGAT BERBAHAYA! Tindakan coba-coba obat membahayakan keselamatan jiwa.'
          },
          { id: 'd', text: 'Menyimpan seluruh artikel untuk dibaca saat sedang sakit',
            isCorrect: false,
            explanation: 'Salah. Mempercayai resep berbahaya membahayakan diri sendiri.'
          }
        ],
        hint: 'Perhatikan kata "menyembuhkan semua penyakit dalam 3 menit" — klaim instan tanpa logika adalah ciri utama hoaks komersial.',
        verifiedSource: {
          institution: 'Kementerian Kesehatan RI (Kemenkes)',
          title: 'Portal Edukasi Sehat Negeriku: Verifikasi Fakta Medis & Obat Tradisional',
          yearOrDate: '2024',
          url: 'https://kemkes.go.id',
          note: 'Setiap pengobatan wajib memiliki uji klinis medis terstandar untuk menjamin keamanan organ tubuh anak.'
        }
      },
      uncover: {
        prompt: 'Pilih klaim yang SANGAT BERBAHAYA dan tidak berdasar sains medis:',
        learningGoal: 'Menemukan klaim berbahaya yang bertentangan dengan sains kesehatan dan membahayakan keselamatan tubuh.',
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
        learningGoal: 'Memeriksa hierarki kredibilitas sumber medis dan merujuk pada Kementerian Kesehatan atau dokter berlisensi.',
        sources: [
          {
            id: 's1',
            title: 'Kementerian Kesehatan RI (Kemenkes) & Dokter Spesialis',
            type: 'Otoritas Kesehatan Resmi',
            icon: 'BarChart2',
            description: 'WHO: Lembaga kesehatan negara & dokter berizin • EVIDENCE: Uji klinis berbasis bukti sains • WHY: Menjaga kesehatan masyarakat.',
            isMostReliable: true,
            explanation: 'SEMPURNA! Rekomendasi kesehatan wajib bersumber dari tenaga medis terdaftar dan regulasi Kemenkes.',
            authorOrPublisher: 'Kemenkes RI & Ikatan Dokter Anak Indonesia (IDAI)',
            date: 'Pedoman Resmi 2023/2024',
            evidenceSummary: 'Hasil telaah klinis dan riset farmakologi medis',
            purpose: 'Perlindungan kesehatan dan keselamatan jiwa masyarakat'
          },
          {
            id: 's2',
            title: 'Pesan Berantai WhatsApp Berbintang Banyak',
            type: 'Pesan Diteruskan',
            icon: 'FileText',
            description: 'WHO: Anonim (tidak ada identitas dokter) • EVIDENCE: Cerita klaim sepihak • WHY: Disebarkan tanpa tanggung jawab.',
            isMostReliable: false,
            explanation: 'Pesan berantai anonim sering kali disusupi mitos tanpa metodologi ilmiah.',
            authorOrPublisher: 'Penerus Pesan Anonim',
            date: 'Diteruskan berkali-kali',
            evidenceSummary: 'Tanpa data laboratorium atau izin BPOM',
            purpose: 'Penyebaran kabar angin di grup obrolan'
          },
          {
            id: 's3',
            title: 'Iklan Pop-up Game Ponsel',
            type: 'Iklan Promosi',
            icon: 'Gamepad2',
            description: 'WHO: Perusahaan pemasang iklan • EVIDENCE: Testimoni bayaran • WHY: Menjual produk demi keuntungan uang.',
            isMostReliable: false,
            explanation: 'Iklan berorientasi profit penjualan, bukan diagnosis klinis objektif.',
            authorOrPublisher: 'Agen Periklanan Digital',
            date: 'Iklan bersponsor hari ini',
            evidenceSummary: 'Klaim promosi komersial sepihak',
            purpose: 'Menjual barang demi keuntungan finansial'
          },
          {
            id: 's4',
            title: 'Komentar Bot Spam di Medsos',
            type: 'Tautan Phishing',
            icon: 'AlertCircle',
            description: 'WHO: Akun bot otomatis • EVIDENCE: Tautan palsu berbahaya • WHY: Menipu atau mencuri data pengguna.',
            isMostReliable: false,
            explanation: 'Berisiko malware dan pencurian data pribadi.',
            authorOrPublisher: 'Akun Palsu Bot',
            date: 'Spam 5 menit lalu',
            evidenceSummary: 'Tautan mencurigakan tanpa artikel ilmiah',
            purpose: 'Penipuan phishing digital'
          }
        ],
        hint: 'Gunakan prinsip WHO (Lembaga resmi Kemenkes/IDAI) & EVIDENCE (Uji klinis ilmiah dokter).',
        verifiedSource: {
          institution: 'Ikatan Dokter Anak Indonesia (IDAI) & Kemenkes RI',
          title: 'Pedoman Penanganan Demam dan Sakit Ringan pada Anak di Rumah',
          yearOrDate: '2023',
          url: 'https://idai.or.id',
          note: 'Penggunaan obat herbal atau ramuan tradisional harus memiliki izin edar resmi Badan Pengawas Obat dan Makanan (BPOM).'
        }
      },
      safeguard: {
        prompt: 'Sikap etis mencegah penyebaran misinformasi berantai (People – Data – Ideas):',
        learningGoal: 'Mencegah penyebaran pesan berbahaya ke keluarga (People), menjaga privasi (Data), dan merujuk ilmu medis (Ideas).',
        items: [
          {
            id: 'sg1',
            category: 'people',
            statement: 'PEOPLE: Tidak meneruskan (forward) pesan resep ajaib ke grup keluarga sebelum diverifikasi dokter agar tidak mencelakai kakek, nenek, atau adik.',
            shouldBeEnabled: true,
            explanation: 'Benar! Menahan jempol dari membagikan hoaks adalah benteng utama keselamatan keluarga.'
          },
          {
            id: 'sg2',
            category: 'people',
            statement: 'PEOPLE: Menakut-nakuti teman dengan klaim bahwa resep palsu itu harus diminum agar tidak sakit.',
            shouldBeEnabled: false,
            explanation: 'Tepat untuk TIDAK mencentang! Menyesatkan kawan bertentangan dengan akhlak mulia.'
          },
          {
            id: 'sg3',
            category: 'ideas',
            statement: 'IDEAS: Memberi tahu guru UKS sekolah dan menunjukkan sumber resmi Kemenkes jika melihat ada kawan yang mencoba meminum ramuan berbahaya.',
            shouldBeEnabled: true,
            explanation: 'Benar! Menyelamatkan kawan dan merujuk otoritas resmi adalah tanggung jawab moral tertinggi.'
          }
        ],
        verifiedSource: {
          institution: 'Kementerian Komunikasi dan Informatika RI (Kominfo)',
          title: 'Laporan Cek Fakta Hoaks Kesehatan Nasional',
          yearOrDate: '2024',
          url: 'https://cekfakta.kominfo.go.id'
        }
      },
      transform: {
        prompt: 'Tindakan transformatif untuk menghentikan replikasi misinformasi berantai (READ → CLOSE → THINK → CREATE):',
        learningGoal: 'Membuat karya edukasi kesehatan dengan pemahaman sendiri (READ → CLOSE → THINK → CREATE).',
        readCloseThinkPrompts: {
          step1Read: 'Baca fakta resmi Kemenkes: Penanganan sakit ringan pada anak membutuhkan istirahat, hidrasi cukup, dan obat berizin BPOM, bukan air garam mendidih.',
          step2Close: 'Tutup layar dan pahami intinya dengan kata-katamu sendiri.',
          step3ThinkQuestions: [
            'Mengapa anggota keluarga mudah percaya pesan berantai di WhatsApp?',
            'Bagaimana cara kita menjelaskan arahan dokter secara sopan tanpa menyinggung perasaan orang tua?'
          ],
          step4CreateProducts: [
            'Brosur saku mini "Cek Fakta Resep Kesehatan Sehat" untuk mading kelas',
            'Pesan edukatif santun untuk dibagikan di grup chat keluarga',
            'Catatan pengingat pribadi tentang bahaya mencoba ramuan tanpa izin dokter'
          ]
        },
        actions: [
          {
            id: 'a1',
            label: 'Melaporkan situs berita palsu ke kanal resmi Kominfo aduankonten dan membuat poster edukasi mading dari rujukan Kemenkes',
            isCorrect: true,
            explanation: 'Sempurna! Transformasi yang efektif: menggunakan kanal aduan resmi dengan bukti sains otentik.'
          },
          {
            id: 'a2',
            label: 'Membuat video parodi resep berbahaya ke media sosial publik tanpa peringatan bahaya',
            isCorrect: false,
            explanation: 'Keliru! Anak-anak lain bisa meniru resep berbahaya tersebut secara harfiah.'
          },
          {
            id: 'a3',
            label: 'Menjauhi kawan yang sedang sakit tanpa rasa empati kepedulian',
            isCorrect: false,
            explanation: 'Salah! Kita diajarkan saling tolong-menolong dan menjaga sesama.'
          }
        ],
        verifiedSource: {
          institution: 'Direktorat Promosi Kesehatan Kementerian Kesehatan RI',
          title: 'Panduan Praktis Perilaku Hidup Bersih dan Sehat (PHBS) Sekolah',
          yearOrDate: '2023',
          url: 'https://ayosehat.kemkes.go.id'
        }
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
          { id: 'opt1', label: '1. Air hangat bersih menjaga hidrasi tubuh kita', isCorrect: false, feedback: 'Ini anjuran medis yang benar.' },
          { id: 'opt2', label: '2. Garam mendidih cabai sembuhkan demam tiga menit', isCorrect: true, feedback: 'Benar! Ini resep beracun kloningan. Pintu terbuka!' },
          { id: 'opt3', label: '3. Istirahat cukup membantu memulihkan daya tahan tubuh', isCorrect: false, feedback: 'Fakta sains akurat.' },
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
          { id: 'opt1', label: 'Pesan Berantai Anonim Media Sosial', isCorrect: false, feedback: 'Jatuh ke cairan uji coba palsu!' },
          { id: 'opt2', label: 'Kementerian Kesehatan Republik Indonesia Resmi', isCorrect: true, feedback: 'Jembatan sains berdiri kokoh menyeberangkanmu!' },
          { id: 'opt3', label: 'Artikel Blog Gosip Pribadi Santai', isCorrect: false, feedback: 'Pilar komersial roboh!' }
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
          { id: 'opt1', label: 'Unggah rekam medis kawan ke ruang publik', isCorrect: false, feedback: 'Alarm pelanggaran privasi menyala!' },
          { id: 'opt2', label: 'Jaga kerahasiaan data medis kawan dengan adab', isCorrect: true, feedback: 'Sensor privasi hijau! Jalan terbuka aman!' }
        ]
      }
    ],
    boss: {
      name: 'REPLICATOR-BOT 3.0',
      title: 'Mecha Replikasi Misinformasi Berantai (Red/Pink)',
      maxHp: 420,
      color: '#f43f5e',
      glitchLevel: 3,
      phases: [
        {
          phase: 1,
          hpThreshold: 280,
          projectileSpeed: 2.8,
          spawnInterval: 110,
          textClues: ['Resep Mendidih!', 'Kloning Berita', 'Hoaks Viral']
        },
        {
          phase: 2,
          hpThreshold: 140,
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
        { id: 'opt_a', text: 'Data pribadi dilindungi hukum dan penyebarannya memicu bahaya nyata fisik',
          isCorrect: true,
          explanation: 'Tepat sekali! SAFEGUARD memprioritaskan perlindungan privasi, mitigasi bahaya fisik/mental, dan kepatuhan hukum perlindungan data pribadi (UU PDP).'
        },
        { id: 'opt_b', text: 'Kita hanya boleh mempercayai sistem jika bertanda centang biru resmi',
          isCorrect: false,
          explanation: 'Keliru. Ini tidak menjawab esensi perlindungan privasi dan dampak konsekuensi.'
        },
        { id: 'opt_c', text: 'Orang dalam daftar mungkin akan membalas mengejek kita balik nanti',
          isCorrect: false,
          explanation: 'Kurang tepat. Alasan ini hanya kekhawatiran emosional pribadi, bukan penalaran etika perlindungan privasi bersama.'
        },
        { id: 'opt_d', text: 'Boleh disebarkan asalkan nomor telepon disamarkan sebagian angka digit saja',
          isCorrect: false,
          explanation: 'Salah. Membagikan daftar perundungan tetap melanggar etika adab Muraqabah.'
        }
      ],
      hint: 'Pilihlah jawaban yang menegaskan perlindungan data pribadi dan pencegahan bahaya nyata bagi sesama.',
      successMessage: 'Luar biasa! Ketajaman etika Muraqabah membawamu membuka tantangan Level 4!'
    },
    questData: {
      query: {
        npcSpeaker: 'Elder Muraqabah (Didampingi Zaki & Aisyah)',
        learningGoal: 'Menentukan tujuan dan mendeteksi motif pemotongan kalimat (out-of-context) yang memicu provokasi di lingkungan sekolah.',
        scaffolding: {
          modelExample: 'Contoh Aisyah: "Saat membaca potongan pidato kepala sekolah yang terkesan sangat keras, aku bertanya: Apakah ini kalimat lengkapnya, atau ada bagian syarat waktu yang sengaja dihilangkan?"',
          studentHint: 'Tanyakan konteks kalimat seutuhnya. Waspadai kalimat yang dipotong separuh untuk mengadu domba.'
        },
        scenario: 'AI merilis ringkasan pidato kepala sekolah: "Kepala sekolah menyatakan bahwa kegiatan bermain game di akhir pekan harus dilarang total untuk seluruh anak." Namun dalam rekaman utuh, kepala sekolah berkata: "...jika tidak membagi waktu belajar, maka bermain game tanpa batas bisa merugikan."',
        question: 'Bagaimana kamu menilai niat di balik pemotongan konteks pidato tersebut?',
        options: [
          { id: 'a', text: 'Kalimat sengaja dipenggal demi memicu kemarahan siswa terhadap pihak sekolah',
            isCorrect: true,
            explanation: 'Benar sekali! Memotong kalimat di luar konteks adalah taktik provokasi untuk mengadu domba warga sekolah.'
          },
          { id: 'b', text: 'Langsung membuat aksi protes tanpa mendengar rekaman utuh pidato aslinya',
            isCorrect: false,
            explanation: 'Keliru dan reaktif. Bertindak sebelum tabayyun merusak kerukunan sekolah.'
          },
          { id: 'c', text: 'Menyalahkan pihak kepala sekolah karena memakai bahasa pidato sangat rumit',
            isCorrect: false,
            explanation: 'Kurang tepat. Masalah utamanya ada pada distorsi AI yang memenggal kalimat secara tidak adil.'
          },
          { id: 'd', text: 'Menganggap mesin selalu benar tanpa perlu memeriksa kalimat rekaman aslinya',
            isCorrect: false,
            explanation: 'Salah. AI sering membuang nuansa penting dalam ringkasan otomatis.'
          }
        ],
        hint: 'Bandingkan kalimat asli yang lengkap dengan ringkasan sepihak yang menghilangkan syarat waktu.',
        verifiedSource: {
          institution: 'Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi (Kemendikbudristek)',
          title: 'Pedoman Pencegahan dan Penanganan Kekerasan di Lingkungan Satuan Pendidikan (PPKSP)',
          yearOrDate: '2023',
          url: 'https://merdekabelajar.kemdikbud.go.id',
          note: 'Warga sekolah didorong menyelesaikan salah paham informasi melalui dialog tabayyun yang hangat dan bermartabat.'
        }
      },
      uncover: {
        prompt: 'Pilih contoh pemenggalan konteks (cherry-picking) yang paling merusak fakta kebenaran:',
        learningGoal: 'Menemukan distorsi pemenggalan kutipan (cherry-picking) yang membalikkan maksud pesan sesungguhnya.',
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
        learningGoal: 'Memeriksa dokumen transkrip dan rekaman primer resmi sekolah untuk mengembalikan konteks utuh.',
        sources: [
          {
            id: 's1',
            title: 'Rekaman Video & Transkrip Pidato Utuh Resmi Sekolah',
            type: 'Dokumen Primer Asli',
            icon: 'Camera',
            description: 'WHO: Tim Dokumentasi Sekolah • EVIDENCE: Video lengkap awal sampai akhir • WHY: Arsip resmi transparansi kegiatan.',
            isMostReliable: true,
            explanation: 'SEMPURNA! Transkrip dan rekaman lengkap memperlihatkan konteks kalimat secara utuh tanpa potongan.',
            authorOrPublisher: 'Tim Media & Humas SD Lazuardi GCS',
            date: 'Dokumentasi Acara Kemarin',
            evidenceSummary: 'Rekaman video durasi penuh 30 menit beserta transkrip audio',
            purpose: 'Transparansi informasi dan arsip sekolah'
          },
          {
            id: 's2',
            title: 'Tangkapan Layar Pesan Gosip Kelas',
            type: 'Media Sekunder Bias',
            icon: 'Smartphone',
            description: 'WHO: Pengirim anonim • EVIDENCE: Potongan gambar chat tanpa timestamp • WHY: Mengadu domba.',
            isMostReliable: false,
            explanation: 'Tangkapan layar mudah direkayasa dan sering kali tidak lengkap.',
            authorOrPublisher: 'Akun Anonim Grup Kelas',
            date: 'Tangkapan layar tadi malam',
            evidenceSummary: 'Potongan obrolan singkat yang dipotong sebagian',
            purpose: 'Membuat sensasi di kalangan siswa'
          },
          {
            id: 's3',
            title: 'Ringkasan Bot AI Baru Lainnya',
            type: 'Generatif Sintetis',
            icon: 'Bot',
            description: 'WHO: Algoritma teks generatif • EVIDENCE: Tebakan kata berikutnya • WHY: Menghasilkan jawaban otomatis.',
            isMostReliable: false,
            explanation: 'AI kedua tetap tidak memiliki rekaman fakta primer.',
            authorOrPublisher: 'Model Bahasa Kecerdasan Buatan',
            date: 'Dihasilkan hari ini',
            evidenceSummary: 'Tebakan probabilitas bahasa tanpa data rekaman asli',
            purpose: 'Menghasilkan respon obrolan otomatis'
          },
          {
            id: 's4',
            title: 'Desas-desus di Kantin Sekolah',
            type: 'Anekdotal',
            icon: 'FileText',
            description: 'WHO: Cerita dari mulut ke mulut • EVIDENCE: Ingatan samar tanpa catatan • WHY: Obrolan istirahat.',
            isMostReliable: false,
            explanation: 'Cerita mulut ke mulut adalah sumber paling rentan distorsi.',
            authorOrPublisher: 'Kabar Burung Warga Sekolah',
            date: 'Tadi siang',
            evidenceSummary: 'Ingatan yang telah dibumbui opini pribadi',
            purpose: 'Gosip istirahat'
          }
        ],
        hint: 'Gunakan prinsip WHO (Dokumentasi resmi sekolah) & EVIDENCE (Rekaman video dan transkrip utuh).',
        verifiedSource: {
          institution: 'Komisi Informasi Pusat RI (KIP) & Kemendikbudristek',
          title: 'Standar Layanan Informasi Publik di Satuan Pendidikan Dasar',
          yearOrDate: '2023',
          url: 'https://komisiinformasi.go.id',
          note: 'Dokumen primer adalah rekaman utuh yang disahkan oleh pihak berwenang di tempat peristiwa terjadi.'
        }
      },
      safeguard: {
        prompt: 'Evaluasi perlindungan privasi dan dampak konsekuensi (People – Data – Ideas):',
        learningGoal: 'Mengevaluasi dampak etis privasi (Data), mencegah perundungan siber (People), dan menjaga kebenaran kutipan (Ideas).',
        items: [
          {
            id: 'sg1',
            category: 'data',
            statement: 'DATA: Tidak menyebarkan data pribadi kawan (nama, nomor telepon, foto rumah) meskipun mereka dituduh berbuat salah agar tidak memicu kejahatan siber.',
            shouldBeEnabled: true,
            explanation: 'Benar! Menjaga privasi orang lain mencegah ancaman kejahatan nyata dan perundungan siber.'
          },
          {
            id: 'sg2',
            category: 'people',
            statement: 'PEOPLE: Membagikan potongan kutipan kontroversial agar guru mendapat kecaman dari warganet.',
            shouldBeEnabled: false,
            explanation: 'Tepat untuk TIDAK mencentang! Tindakan provokatif melanggar adab kesantunan dan kejujuran.'
          },
          {
            id: 'sg3',
            category: 'ideas',
            statement: 'IDEAS: Mengingatkan teman bahwa menyebarkan potongan fitnah di internet terekam dalam jejak digital dan dipertanggungjawabkan di hadapan Allah SWT (Muraqabah).',
            shouldBeEnabled: true,
            explanation: 'Benar! Kesadaran Muraqabah mengingatkan bahwa setiap ketukan jemari kita diawasi oleh Sang Maha Pencipta.'
          }
        ],
        verifiedSource: {
          institution: 'Badan Siber dan Sandi Negara (BSSN)',
          title: 'Pedoman Keamanan Siber dan Perlindungan Privasi Anak di Ranah Daring',
          yearOrDate: '2023',
          url: 'https://bssn.go.id'
        }
      },
      transform: {
        prompt: 'Tindakan transformasi yang etis dan bijaksana (READ → CLOSE → THINK → CREATE):',
        learningGoal: 'Menyajikan rekaman utuh dan menyelesaikan fitnah dengan damai melalui prinsip READ → CLOSE → THINK → CREATE.',
        readCloseThinkPrompts: {
          step1Read: 'Baca transkrip utuh: Kepala sekolah mengajak siswa pandai membagi waktu antara belajar dan hobi, bukan melarang bermain selamanya.',
          step2Close: 'Tutup layarmu dan pahami intinya secara objektif dengan hatimu.',
          step3ThinkQuestions: [
            'Mengapa beberapa kata yang dipotong dapat memicu kemarahan banyak orang?',
            'Bagaimana cara memulihkan nama baik sekolah dengan tutur kata santun?'
          ],
          step4CreateProducts: [
            'Video klarifikasi santun memutar bagian kalimat utuh yang terpotong',
            'Tulisan majalah dinding sekolah tentang adab tabayyun informasi',
            'Pesan perdamaian di forum kelas untuk saling memaafkan'
          ]
        },
        actions: [
          {
            id: 'a1',
            label: 'Membagikan video rekaman utuh kepada guru dan teman-teman untuk memulihkan konteks pidato secara damai',
            isCorrect: true,
            explanation: 'Luar biasa! Transformasi yang menenangkan suasana: menghadirkan konteks utuh sehingga fitnah terurai damai.'
          },
          {
            id: 'a2',
            label: 'Membuat akun anonim baru untuk menyerang pembuat distorsi kutipan tersebut dengan caci maki',
            isCorrect: false,
            explanation: 'Keliru! Membalas fitnah dengan serangan anonim hanya menambah racun di ruang siber.'
          },
          {
            id: 'a3',
            label: 'Menghapus rekaman utuh dan membiarkan fitnah terus berlanjut di sekolah',
            isCorrect: false,
            explanation: 'Salah! Menyembunyikan kebenaran bertentangan dengan prinsip kejujuran.'
          }
        ],
        verifiedSource: {
          institution: 'Kementerian Pemberdayaan Perempuan dan Perlindungan Anak (KemenPPPA)',
          title: 'Pedoman Pencegahan Perundungan Siber (Cyberbullying) di Satuan Pendidikan',
          yearOrDate: '2023',
          url: 'https://kemenpppa.go.id'
        }
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
          { id: 'opt1', label: '1. Kutipan utuh lengkap dengan syarat waktu pembicara', isCorrect: false, feedback: 'Ini kutipan jujur berkonteks.' },
          { id: 'opt2', label: '2. Kutipan sengaja dipenggal separuh sehingga membalikkan arti', isCorrect: true, feedback: 'Tepat! Ini distorsi cherry-picking. Gerbang terbuka!' },
          { id: 'opt3', label: '3. Pernyataan wajar sesuai arahan resmi pihak sekolah', isCorrect: false, feedback: 'Ini fakta wajar.' },
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
          { id: 'opt1', label: 'Tangkapan Layar Gosip Viral Medsos', isCorrect: false, feedback: 'Pilar runtuh! Screenshot dapat dipotong rekayasa.' },
          { id: 'opt2', label: 'Rekaman Video Asli Berdurasi Penuh', isCorrect: true, feedback: 'Pilar kokoh! Fakta utuh membentangkan jembatan penyeberangan!' },
          { id: 'opt3', label: 'Tebakan Bot Komputer Tanpa Data', isCorrect: false, feedback: 'Pilar rapuh runtuh!' }
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
          { id: 'opt1', label: 'Bocorkan alamat rumah dan nomor telepon kawan', isCorrect: false, feedback: 'Alarm pelanggaran hukum privasi menyala merah!' },
          { id: 'opt2', label: 'Lindungi data pribadi sesuai hukum dan adab', isCorrect: true, feedback: 'Lolos dengan aman! Jalan terbuka bercahaya hijau!' }
        ]
      }
    ],
    boss: {
      name: 'DISTORTION-TITAN 4.0',
      title: 'Mecha Distorsi Konteks & Pelanggaran Privasi (Purple/Cyan)',
      maxHp: 480,
      color: '#a855f7',
      glitchLevel: 4,
      phases: [
        {
          phase: 1,
          hpThreshold: 320,
          projectileSpeed: 3.0,
          spawnInterval: 100,
          textClues: ['Kutipan Terpotong!', 'Distorsi Makna', 'Fitnah Konteks']
        },
        {
          phase: 2,
          hpThreshold: 160,
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
        { id: 'opt_a', text: 'Merusak perangkat keras server di malam hari agar komputer mati',
          isCorrect: false,
          explanation: 'Tindakan anarki yang merusak fasilitas dan melanggar hukum.'
        },
        { id: 'opt_b', text: 'Menyusun laporan bukti audit bias algoritma kepada pihak pimpinan sekolah',
          isCorrect: true,
          explanation: 'Sempurna! Inilah puncak TRANSFORM: Terukur, bertanggung jawab, melalui jalur resmi, berlandaskan data otentik demi maslahat bersama (Khidmah & Ijtihad).'
        },
        { id: 'opt_c', text: 'Membuat akun media sosial untuk mengejek seluruh siswa penerima beasiswa',
          isCorrect: false,
          explanation: 'Keliru dan menyakiti sesama. Mengabaikan adab komunikasi persaudaraan.'
        },
        { id: 'opt_d', text: 'Mendiamkan saja kekeliruan sistem karena merasa diri kita tidak berdaya',
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
        npcSpeaker: 'Dewan Mentor QUEST (Didampingi Zaki & Aisyah)',
        learningGoal: 'Menentukan tujuan dan mendeteksi bias algoritma serta stereotip masa lalu dalam model AI sekolah.',
        scaffolding: {
          modelExample: 'Contoh Zaki & Aisyah: "Saat sistem AI membatasi jurusan sekolah perempuan hanya ke tata boga dan laki-laki ke teknik, kami bertanya: Dari mana AI belajar data ini dan mengapa data lama yang diskriminatif masih dipakai?"',
          studentHint: 'Tanyakan latar belakang data latih AI. Jangan anggap hasil AI sebagai takdir mutlak jika mengabaikan minat dan keadilan manusia.'
        },
        scenario: 'Sistem rekomendasi jurusan otomatis berbasis AI di sekolah merekomendasikan seluruh siswa laki-laki ke bidang teknik mesin, dan seluruh siswa perempuan hanya ke bidang tata boga, mengabaikan minat dan bakat individu.',
        question: 'Bagaimana kamu menilai niat awal dan konteks pembuatan AI tersebut?',
        options: [
          { id: 'a', text: 'Menganalisis sistem dilatih dataset masa lalu yang sarat stereotip gender',
            isCorrect: true,
            explanation: 'Tepat sekali! Membedah latar belakang data pelatihan adalah tingkat tertinggi dalam analisis Query.'
          },
          { id: 'b', text: 'Menganggap rekomendasi mesin sudah pasti takdir mutlak yang tak berubah',
            isCorrect: false,
            explanation: 'Keliru. Kecerdasan manusia dan potensi fitrah tidak boleh dibatasi oleh stereotip mesin.'
          },
          { id: 'c', text: 'Langsung percaya begitu saja tanpa menanyakan metodologi data latih sistem',
            isCorrect: false,
            explanation: 'Salah. Sikap kritis menuntut evaluasi terhadap landasan data AI.'
          },
          { id: 'd', text: 'Menyerah dan berhenti mengejar cita-cita impian masa depan pribadi kita',
            isCorrect: false,
            explanation: 'Kurang tepat! Kita harus percaya diri mengembangkan potensi anugerah Ilahi.'
          }
        ],
        hint: 'Tanyakan: Dari manakah AI ini belajar? Apakah dari data stereotip kuno yang sudah tidak relevan?',
        verifiedSource: {
          institution: 'Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi (Kemendikbudristek)',
          title: 'Panduan Pemanfaatan Kecerdasan Artifisial (AI) yang Bertanggung Jawab dan Inklusif dalam Pendidikan',
          yearOrDate: '2024',
          url: 'https://kemdikbud.go.id',
          note: 'Pemanfaatan AI dalam pendidikan harus menjunjung tinggi kesetaraan kesempatan dan bebas diskriminasi algoritma.'
        }
      },
      uncover: {
        prompt: 'Temukan anomali sistemik yang mencerminkan bias data diskriminatif:',
        learningGoal: 'Menemukan anomali sistemik dan bias diskriminatif yang merugikan potensi siswa.',
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
        learningGoal: 'Memeriksa keadilan sistem bersama kolaborasi pakar pendidikan resmi, dewan guru, dan Kemendikbudristek.',
        sources: [
          {
            id: 's1',
            title: 'Dewan Guru, Psikolog Pendidikan Anak & Kemendikbudristek',
            type: 'Kolaborasi Pakar Resmi',
            icon: 'BarChart2',
            description: 'WHO: Pakar pedagogi, psikolog, dan kementerian kurikulum • EVIDENCE: Riset asesmen talenta anak • WHY: Membina potensi fitrah siswa.',
            isMostReliable: true,
            explanation: 'SEMPURNA! Reformasi kurikulum dan teknologi membutuhkan kolaborasi pakar pedagogi, psikolog anak, dan otoritas resmi.',
            authorOrPublisher: 'Kemendikbudristek & Dewan Guru Pendidikan',
            date: 'Pedoman Kurikulum Nasional 2024',
            evidenceSummary: 'Hasil riset perkembangan anak dan standar asesmen inklusif',
            purpose: 'Mengembangkan bakat siswa secara adil dan manusiawi'
          },
          {
            id: 's2',
            title: 'Akun Bot Ramalan di Media Sosial',
            type: 'Prediksi Semu',
            icon: 'Bot',
            description: 'WHO: Bot peramal zodiak • EVIDENCE: Tebakan tanggal lahir tanpa dasar psikometri • WHY: Hiburan hiburan ringan.',
            isMostReliable: false,
            explanation: 'Bukan rujukan ilmiah terakreditasi.',
            authorOrPublisher: 'Kreator Bot Ramalan Medsos',
            date: 'Setiap hari diperbarui',
            evidenceSummary: 'Tebakan acak tanpa teori psikologi perkembangan',
            purpose: 'Hiburan warganet'
          },
          {
            id: 's3',
            title: 'Polling Instan di Story Instagram',
            type: 'Opini Santai',
            icon: 'Smartphone',
            description: 'WHO: Teman bermain sebaya • EVIDENCE: Voting sesaat tanpa evaluasi nilai • WHY: Mengisi waktu senggang.',
            isMostReliable: false,
            explanation: 'Jajak pendapat medsos tidak memiliki validitas penilaian bakat.',
            authorOrPublisher: 'Teman Sebaya di Medsos',
            date: '2 jam lalu',
            evidenceSummary: 'Voting suka-suka tanpa data rapor',
            purpose: 'Keseruan di media sosial'
          },
          {
            id: 's4',
            title: 'Iklan Kursus Kilat Berbayar',
            type: 'Komersial',
            icon: 'Globe',
            description: 'WHO: Perusahaan bimbingan belajar komersial • EVIDENCE: Janji manis promosi • WHY: Memperoleh pemasukan biaya les.',
            isMostReliable: false,
            explanation: 'Brosur komersial mengutamakan target keuntungan finansial.',
            authorOrPublisher: 'Divisi Pemasaran Lembaga Kursus',
            date: 'Brosur bulan ini',
            evidenceSummary: 'Klaim promosi pemasaran produk',
            purpose: 'Penjualan paket belajar berbayar'
          }
        ],
        hint: 'Gunakan prinsip WHO (Kolaborasi dewan guru & Kemendikbudristek) & EVIDENCE (Standar asesmen bakat anak).',
        verifiedSource: {
          institution: 'UNESCO & Kemendikbudristek',
          title: 'Kerangka Kerja Etika Kecerdasan Artifisial dalam Dunia Pendidikan Anak',
          yearOrDate: '2023 / 2024',
          url: 'https://unesco.org',
          note: 'AI tidak boleh digunakan untuk membatasi cita-cita anak berdasarkan bias historis masa lalu.'
        }
      },
      safeguard: {
        prompt: 'Perlindungan masa depan dan keadilan digital bagi seluruh angkatan siswa (People – Data – Ideas):',
        learningGoal: 'Melindungi data bakat pribadi (Data), menjaga martabat masa depan siswa (People), dan menghargai fitrah anugerah Allah (Ideas).',
        items: [
          {
            id: 'sg1',
            category: 'data',
            statement: 'DATA: Memastikan data bakat pribadi dan riwayat psikologis setiap siswa dijaga kerahasiaannya dan tidak dijual ke pihak ketiga komersial.',
            shouldBeEnabled: true,
            explanation: 'Benar! Data siswa adalah amanah yang wajib dijaga ketat kerahasiaannya.'
          },
          {
            id: 'sg2',
            category: 'people',
            statement: 'PEOPLE: Membiarkan algoritma bias terus dipakai agar kita tidak repot mengadakan evaluasi sistem sekolah.',
            shouldBeEnabled: false,
            explanation: 'Tepat untuk TIDAK mencentang! Membiarkan ketidakadilan merugikan masa depan adik-adik kelas berikutnya.'
          },
          {
            id: 'sg3',
            category: 'ideas',
            statement: 'IDEAS: Menyadari bahwa setiap manusia diciptakan Allah SWT dengan fitrah dan potensi unik yang patut dihargai secara adil (Digital Adab Khidmah).',
            shouldBeEnabled: true,
            explanation: 'Benar! Menghargai kemuliaan potensi setiap hamba Allah adalah cerminan Digital Adab tertinggi.'
          }
        ],
        verifiedSource: {
          institution: 'Pusat Penguatan Karakter (Puspeka) Kemendikbudristek',
          title: 'Pedoman Profil Pelajar Pancasila: Dimensi Bernalar Kritis dan Akhlak Mulia',
          yearOrDate: '2024',
          url: 'https://cerdasberkarakter.kemdikbud.go.id'
        }
      },
      transform: {
        prompt: 'Langkah paripurna TRANSFORM untuk menyelamatkan ekosistem digital sekolah (READ → CLOSE → THINK → CREATE):',
        learningGoal: 'Merumuskan rekomendasi audit etis dan aksi nyata berkelanjutan (Khidmah) melalui READ → CLOSE → THINK → CREATE.',
        readCloseThinkPrompts: {
          step1Read: 'Baca pedoman resmi: AI hanyalah asisten pembanding; keputusan penjurusan bakat mutlak berpusat pada minat dan potensi fitrah siswa.',
          step2Close: 'Tutup layar dan rasakan tanggung jawabmu sebagai pelayan kebaikan (Khidmah).',
          step3ThinkQuestions: [
            'Bagaimana cara kita membela hak Siti dan teman-teman lain secara santun?',
            'Mengapa keterlibatan guru dan orang tua jauh lebih bermakna daripada keputusan bot komputer?'
          ],
          step4CreateProducts: [
            'Naskah rekomendasi perbaikan sistem AI sekolah untuk dewan guru',
            'Poster kampanye sekolah: "Cita-Citaku, Masa Depanku"',
            'Komitmen bersama murid menjaga etika dan kejujuran pemakaian AI'
          ]
        },
        actions: [
          {
            id: 'a1',
            label: 'Menyusun rekomendasi perbaikan model kecerdasan buatan kepada dewan guru menggunakan bahasa santun berlandaskan data otentik',
            isCorrect: true,
            explanation: 'Luar biasa! Inilah puncak TRANSFORM: Memperbaiki sistem secara terstruktur dan menghadirkan solusi yang berkelanjutan demi kemaslahatan bersama (Khidmah).'
          },
          {
            id: 'a2',
            label: 'Memboikot seluruh pelajaran di sekolah dan berhenti belajar selamanya',
            isCorrect: false,
            explanation: 'Keliru! Merugikan diri sendiri dan tidak menyelesaikan akar permasalahan algoritma.'
          },
          {
            id: 'a3',
            label: 'Membuat kabar bohong baru untuk menutupi kesalahan sistem sekolah',
            isCorrect: false,
            explanation: 'Salah besar! Kebohongan tidak akan pernah bisa meluruskan kekeliruan.'
          }
        ],
        verifiedSource: {
          institution: 'Badan Standar, Kurikulum, dan Asesmen Pendidikan (BSKAP) Kemendikbudristek',
          title: 'Panduan Pembelajaran dan Asesmen Kurikulum Merdeka Sekolah Dasar',
          yearOrDate: '2024',
          url: 'https://kurikulum.kemdikbud.go.id'
        }
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
          { id: 'opt1', label: '1. Evaluasi objektif berdasarkan nilai ujian dan karya nyata', isCorrect: false, feedback: 'Ini metode penilaian yang adil.' },
          { id: 'opt2', label: '2. Pembatasan cita-cita siswa karena label gender masa lalu', isCorrect: true, feedback: 'Tepat! Ini bukti bias algoritma sistemik. Gerbang dibuka!' },
          { id: 'opt3', label: '3. Konsultasi berkala bersama guru bimbingan konseling di sekolah', isCorrect: false, feedback: 'Ini proses pendampingan yang baik.' },
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
          { id: 'opt1', label: 'Kanal Ramalan Nasib Zodiak Komersial', isCorrect: false, feedback: 'Pilar runtuh ke jurang kepalsuan!' },
          { id: 'opt2', label: 'Kemendikbudristek Serta Dewan Guru Sekolah', isCorrect: true, feedback: 'Pilar emas terbit! Jembatan kebijaksanaan membimbingmu!' },
          { id: 'opt3', label: 'Polling Iseng Komentar Warganet Medsos', isCorrect: false, feedback: 'Pilar rapuh roboh!' }
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
          { id: 'opt1', label: 'Peduli diri sendiri dan abaikan kebaikan bersama', isCorrect: false, feedback: 'Pintu terkunci! Adab menuntut kepedulian bersama.' },
          { id: 'opt2', label: 'Perbaiki sistem demi kemaslahatan seluruh generasi masa', isCorrect: true, feedback: 'Luar biasa! Cahaya Khidmah membimbingmu menuju arena Final Boss!' }
        ]
      }
    ],
    boss: {
      name: 'CORRUPTION-NEXUS PRIME',
      title: 'Final Boss: Monster Sintesis Distorsi Sistemik (Prismatic/Rainbow)',
      maxHp: 560,
      color: '#ec4899',
      glitchLevel: 5,
      phases: [
        {
          phase: 1,
          hpThreshold: 420,
          projectileSpeed: 3.2,
          spawnInterval: 95,
          textClues: ['Fase 1: Uji Query Niat!', 'Motif Tersembunyi', 'Konteks Bias']
        },
        {
          phase: 2,
          hpThreshold: 280,
          projectileSpeed: 4.0,
          spawnInterval: 75,
          textClues: ['Fase 2: Ungkap Anomali!', 'Overgeneralization', 'Anakronisme']
        },
        {
          phase: 3,
          hpThreshold: 140,
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
