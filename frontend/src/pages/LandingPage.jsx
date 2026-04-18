import { Video, Users, Shield, Zap, Star, ArrowRight, Menu, X, Play } from 'lucide-react';
import { useState , useEffect} from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer , toast } from 'react-toastify';

export function LandingPage(){

const [isMenuOpen , setIsMenuOpen] = useState(false);
const [scrollY, setScrollY] = useState(0);

useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


    const features = [
      {
        icon: Video,
        title: "Crystal Clear Video",
        description: "4K video quality with intelligent bandwidth optimization for seamless experiences"
      },
      {
        icon: Users,
        title: "Unlimited Participants",
        description: "Host meetings with thousands of participants without compromising quality"
      },
      {
        icon: Shield,
        title: "End-to-End Security",
        description: "Military-grade encryption ensures your conversations stay private and secure"
      },
      {
        icon: Zap,
        title: "Lightning Fast",
        description: "Connect instantly with our global network of optimized servers"
      }
    ];


return(
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
   

<div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse -top-48 -left-48" />
        <div className="absolute w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000 -bottom-32 -right-32" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent animate-pulse" />
      </div>

   <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrollY > 50 ? 'bg-slate-900/90 backdrop-blur-xl shadow-2xl' : 'bg-transparent'
      }`}>
    <div className="mx-auto max-w-7xl py-4 flex justify-between sm:px-6 lg:px-8 sm:py-4">
 <div className="flex items-center space-x-2">
  <div className="items-center w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex justify-center">
    <Video className='text-white w-8 h-8'></Video>
  </div>
   
        <span className='text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent'>AuraMeet</span>
   

 </div>

 <div className="hidden md:flex items-center space-x-8">



       {['Home','About'].map((item) => (
                <a
                  key={item}
                 to={`/${item.toLowerCase()}`}
                  className="relative text-slate-300 hover:text-white transition-all duration-300 group"
                >
                  {item}
                  <span className='w-0 absolute bg-gradient-to-r from-purple-500 to-blue-500 h-0.5 left-0 -bottom-0.5 transition-all duration-300 group-hover:w-full'/>
                </a>
              ))}
                <Link to='/auth'className="relative text-slate-300 hover:text-white transition-all duration-300 group">
                Login In
                <span className='w-0 absolute bg-gradient-to-r from-purple-500 to-blue-500 h-0.5 left-0 -bottom-0.5 transition-all duration-300 group-hover:w-full'/>

                </Link>

              <Link to = "/auth" className='px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full items-center hover:from-purple-700 hover:to-blue-700 px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-medium' >
                Get Started
              </Link>
    </div>


<button className='md:hidden z-50 p-2 text-white' onClick={() => {setIsMenuOpen(!isMenuOpen)}}>

  {isMenuOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' /> } 
</button>

    </div>

{/* mobile menu */}

<div className={`md:hidden absolute top-full left-0 w-full bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 transition-all duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
 <div className="flex flex-col space-y-4 p-6">
       {['Home','About'].map((item) => (
                <a
                  key={item}
                 href={`#${item.toLowerCase()}`}
                  className="text-slate-300 hover:text-white transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))} 
<Link to='/auth'className="relative text-slate-300 hover:text-white transition-all duration-300 group">
                Login In
                <span className='w-0 absolute bg-gradient-to-r from-purple-500 to-blue-500 h-0.5 left-0 -bottom-0.5 transition-all duration-300 group-hover:w-full'/>

                </Link>



                <Link to="/auth"  className='px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full  rounded-full w-fit font-medium' >
                Get Started
              </Link>
    </div>
</div>
  </nav>



  {/* hero-section */}

<section className='relative min-h-screen flex items-center justify-center px-4 pt-20'>

<div className='max-w-6xl mx-auto text-center relative z-10'>
  <div className='space-y-8'>
  <div className='space-y-6'>
    <h1 className='text-5xl md:text-7xl font-bold leading-tight'>
   Connect Beyond
<span className='block bg-gradient bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse'>
  Boundaries
</span>



    </h1>
     <p className=" text-base sm:text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Experience the future of video communication with AuraMeet's cutting-edge technology, 
                crystal-clear quality, and seamless collaboration tools.
              </p>
  </div>

<div className='flex flex-col sm:flex-row gap-6 justify-center items-center'>
  <button className='group relative bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center gap-2'>
    Start Meeting Now
    <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform duration-300' />
  </button>
</div>

{/* stats */}

<div className='grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto pt-10 md:pt-16'>

{
  [
    { number: '10M+', label: 'Active Users' },
    { number: '99.9%', label: 'Uptime' },
    { number: '150+', label: 'Countries' },
    { number: '4.9★', label: 'Rating' }
  ].map((stat,index) => (
    <div key={index} className='text-center group cursor-pointer'> 
    <div className='text-3xl md:text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300'>
      {stat.number}
    </div>
    <div className='text-slate-400 text-sm md:text-base'>
      {stat.label}
      </div>
    </div>
  ))
}




</div>

  </div>

</div>







</section>



{/* features section */}

<section className='py-20 px-4 relative'>
<div className='max-w-6xl mx-auto'>

<div className='text-center mb-16 space-y-6'>

  <h2 className='text-4xl md:text-5xl font-bold'>
    Why Choose
    
    <span className='bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent ml-4'>AuraMeet?</span>
  </h2>
<p className="text-base md:text-xl text-slate-300 max-w-3xl mx-auto">
  Built for the modern world, designed for everyone. Experience video calling like never before.

</p>
</div>



<div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
 {features.map((feature , index) => (
  <div key={index} className='group relative p-8 rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 hover:border-purple-500/50 transition-all duration-500 hover:transform hover:scale-105 cursor-pointer'>
<div className='absolute inset-0 bg-gradient-to-b from-purple-500/10 to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500'/>
<div>
  <feature.icon className='w-12 h-12 text-purple-400 group-hover:text-purple-300 transition-colors duration-300'/>

  <h3 className='text-xl font-bold text-white group-hover:text-purple-100 transition-colors duration-300'>
    {feature.title}
  </h3>

  <p className='text-slate-400 group-hover:text-slate-300 transition-colors duration-300'>
    {feature.description}
  </p>
  </div>


  </div>
 ))}
</div>

</div>


</section>



{/* footer */}

<footer className='py-12 px-4 border-t border-slate-800'>
 <div className='max-w-6xl mx-auto'>

<div className='flex flex-col md:flex-row justify-between items-center mb-8'>

<div className='flex items-center space-x-2 mb-6 md:mb-0'>
    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
    <Video className='w-4 h-4 text-white'/>
  </div>
  <span className='text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent'>Aurameet</span>
</div>

<div className='flex flex-wrap justify-center md:justify-end space-x-8 text-slate-400'>
  {['Privacy', 'Terms', 'Support', 'Blog'].map((item) => (
                <a key={item} href="#" className="hover:text-white transition-colors duration-300">
                  {item}
                </a>
              ))}
</div>




</div>

<div className="text-center text-slate-500 pt-8 border-t border-slate-800">
            © 2025 AuraMeet. All rights reserved.
            <br>
            </br>
            by <i>Raj yadav</i>
          </div>

 </div>

</footer>

   <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          toastStyle={{
            backgroundColor: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid #475569'
          }}
        />
   
   
   
    </div>
)










}