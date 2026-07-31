import { WebGLGallery } from './components/WebGLGallery';
import './index.css';

function App() {
  const galleryItems = [
    {
      id: 'item1',
      label: 'Project Alpha',
      imageSrc:
        'https://raw.githubusercontent.com/Hongda-Lin/ImageStore/master/image/700px-卡冈图雅-像素.png',
    },
    {
      id: 'item2',
      label: 'Design Beta',
      imageSrc:
        'https://raw.githubusercontent.com/Hongda-Lin/ImageStore/master/img700px-Dot_scenario_s2_ep1_ch4.png',
    },
    {
      id: 'item3',
      label: 'Creative Gamma',
      imageSrc:
        'https://raw.githubusercontent.com/Hongda-Lin/ImageStore/master/imggsnxpqsobtbwodv20gzdbxnlvk45k5p.png',
    },
    {
      id: 'item4',
      label: 'Visual Delta',
      imageSrc:
        'https://raw.githubusercontent.com/Hongda-Lin/ImageStore/master/img700px-圣域封印.png',
    },
    {
      id: 'item5',
      label: 'Aesthetic Epsilon',
      imageSrc:
        'https://raw.githubusercontent.com/Hongda-Lin/ImageStore/master/img700px-Dot_scenario_s2_ep1_ch2.png',
    },
  ];

  return <WebGLGallery items={galleryItems} />;
}

export default App;
