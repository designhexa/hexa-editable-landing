
import { MenuItem, Page } from '@/types/editor';

export const defaultNavigation: MenuItem[] = [
  {
    id: 'home-link',
    title: 'Home',
    url: '/',
    order: 0
  },
  {
    id: 'about-link',
    title: 'About',
    url: '/about',
    order: 1
  },
  {
    id: 'services-link',
    title: 'Services',
    url: '/services',
    order: 2
  },
  {
    id: 'contact-link',
    title: 'Contact',
    url: '/contact',
    order: 3
  }
];

export const defaultHomePage: Page = {
  id: 'home-page',
  title: 'Home',
  slug: '/',
  isPublished: true,
  publishedAt: new Date().toISOString(),
  sections: [
    {
      id: 'header-section',
      type: 'header',
      properties: {
        backgroundColor: 'bg-white',
        paddingY: 'py-4',
        paddingX: 'px-4',
        isDraggableGrid: 'false'
      },
      elements: [
        {
          id: 'header-logo',
          type: 'image',
          content: '/placeholder.svg',
          properties: {
            className: 'h-10 w-auto'
          }
        },
        {
          id: 'header-title',
          type: 'heading',
          content: 'My Website',
          properties: {
            className: 'text-xl font-bold'
          }
        }
      ],
    },
    {
      id: 'hero-section',
      type: 'content',
      properties: {
        backgroundColor: 'bg-gradient-to-r from-editor-blue to-editor-purple',
        paddingY: 'py-20',
        paddingX: 'px-4'
      },
      elements: [
        {
          id: 'hero-heading',
          type: 'heading',
          content: 'Buat Website Impian Anda dengan Editor Visual',
          properties: {
            className: 'text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center mb-6'
          }
        },
        {
          id: 'hero-text',
          type: 'text',
          content: 'Edit konten, gambar, dan tata letak website Anda tanpa perlu reload halaman.',
          properties: {
            className: 'text-lg md:text-xl text-white text-center max-w-3xl mx-auto mb-8'
          }
        },
        {
          id: 'hero-button',
          type: 'button',
          content: 'Coba Sekarang',
          properties: {
            className: 'bg-white text-editor-blue hover:bg-gray-100 px-6 py-3 rounded-lg font-medium text-lg mx-auto block'
          }
        }
      ],
    },
    {
      id: 'features-section',
      type: 'content',
      properties: {
        backgroundColor: 'bg-white',
        paddingY: 'py-16',
        paddingX: 'px-4',
        isGridLayout: 'true',
        gridColumns: 'grid-cols-1 md:grid-cols-3',
        gridRows: 'auto',
        gridGap: 'gap-8'
      },
      elements: [
        {
          id: 'features-heading',
          type: 'heading',
          content: 'Fitur Unggulan',
          properties: {
            className: 'text-3xl md:text-4xl font-bold text-center mb-12 col-span-full'
          },
          gridPosition: {
            column: 'col-span-full',
            row: 'row-start-1',
            columnSpan: '',
            rowSpan: ''
          }
        },
        {
          id: 'feature-1-image',
          type: 'image',
          content: '/placeholder.svg',
          properties: {
            className: 'w-16 h-16 mx-auto mb-4'
          },
          gridPosition: {
            column: 'md:col-start-1',
            row: 'row-start-2',
            columnSpan: '',
            rowSpan: ''
          }
        },
        {
          id: 'feature-1-heading',
          type: 'heading',
          content: 'Editor Visual',
          properties: {
            className: 'text-xl font-semibold text-center mb-2'
          },
          gridPosition: {
            column: 'md:col-start-1',
            row: 'row-start-3',
            columnSpan: '',
            rowSpan: ''
          }
        },
        {
          id: 'feature-1-text',
          type: 'text',
          content: 'Edit tampilan website secara visual, langsung melihat hasilnya tanpa perlu reload halaman.',
          properties: {
            className: 'text-gray-600 text-center max-w-md mx-auto mb-12'
          },
          gridPosition: {
            column: 'md:col-start-1',
            row: 'row-start-4',
            columnSpan: '',
            rowSpan: ''
          }
        },
        {
          id: 'feature-2-image',
          type: 'image',
          content: '/placeholder.svg',
          properties: {
            className: 'w-16 h-16 mx-auto mb-4'
          },
          gridPosition: {
            column: 'md:col-start-2',
            row: 'row-start-2',
            columnSpan: '',
            rowSpan: ''
          }
        },
        {
          id: 'feature-2-heading',
          type: 'heading',
          content: 'Section Builder',
          properties: {
            className: 'text-xl font-semibold text-center mb-2'
          },
          gridPosition: {
            column: 'md:col-start-2',
            row: 'row-start-3',
            columnSpan: '',
            rowSpan: ''
          }
        },
        {
          id: 'feature-2-text',
          type: 'text',
          content: 'Tambahkan dan atur section baru dengan mudah untuk memperkaya konten website Anda.',
          properties: {
            className: 'text-gray-600 text-center max-w-md mx-auto mb-12'
          },
          gridPosition: {
            column: 'md:col-start-2',
            row: 'row-start-4',
            columnSpan: '',
            rowSpan: ''
          }
        },
        {
          id: 'feature-3-image',
          type: 'image',
          content: '/placeholder.svg',
          properties: {
            className: 'w-16 h-16 mx-auto mb-4'
          },
          gridPosition: {
            column: 'md:col-start-3',
            row: 'row-start-2',
            columnSpan: '',
            rowSpan: ''
          }
        },
        {
          id: 'feature-3-heading',
          type: 'heading',
          content: 'Multi Page Management',
          properties: {
            className: 'text-xl font-semibold text-center mb-2'
          },
          gridPosition: {
            column: 'md:col-start-3',
            row: 'row-start-3',
            columnSpan: '',
            rowSpan: ''
          }
        },
        {
          id: 'feature-3-text',
          type: 'text',
          content: 'Buat dan kelola banyak halaman untuk website lengkap dengan navigasi yang intuitif.',
          properties: {
            className: 'text-gray-600 text-center max-w-md mx-auto'
          },
          gridPosition: {
            column: 'md:col-start-3',
            row: 'row-start-4',
            columnSpan: '',
            rowSpan: ''
          }
        }
      ],
    },
    {
      id: 'cta-section',
      type: 'content',
      properties: {
        backgroundColor: 'bg-editor-indigo',
        paddingY: 'py-16',
        paddingX: 'px-4'
      },
      elements: [
        {
          id: 'cta-heading',
          type: 'heading',
          content: 'Siap Untuk Membangun Website Anda?',
          properties: {
            className: 'text-3xl md:text-4xl font-bold text-white text-center mb-6'
          }
        },
        {
          id: 'cta-text',
          type: 'text',
          content: 'Mulai sekarang dan nikmati kemudahan membuat website profesional.',
          properties: {
            className: 'text-lg text-white text-center max-w-2xl mx-auto mb-8'
          }
        },
        {
          id: 'cta-button',
          type: 'button',
          content: 'Daftar Gratis',
          properties: {
            className: 'bg-white text-editor-indigo hover:bg-gray-100 px-6 py-3 rounded-lg font-medium text-lg mx-auto block'
          }
        }
      ],
    },
    {
      id: 'footer-section',
      type: 'footer',
      properties: {
        backgroundColor: 'bg-gray-800',
        paddingY: 'py-8',
        paddingX: 'px-4'
      },
      elements: [
        {
          id: 'footer-text',
          type: 'text',
          content: '© 2025 Website Builder. All rights reserved.',
          properties: {
            className: 'text-gray-400 text-center'
          }
        }
      ],
    }
  ],
};
