// components/Footer.tsx

import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="flex bg-gray-200 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-800 sticky justify-center bottom-0 ">
      <div className="max-w-7xl xs:mr-4 py-4 px-2 sm:px-6 lg:px-8">
        {/*<div className="flex justify-between hidden">
          <div>
            <p className="flex text-gray-700 dark:text-gray-300">&copy; {new Date().getFullYear()} <Link href='https://simbox.io'>&nbsp;Simbox.io</Link>. All rights reserved.</p>
          </div>
          <div>
            <nav className="flex space-x-4">
              <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-gray-900">
                Terms of Service
              </a>
              <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-gray-900">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-gray-900">
                Contact Us
              </a>
            </nav>
          </div>
        </div>*/}
        <div className="text-xs text-gray-800 dark:text-gray-200">
          Powered by MCMS from <Link href='https://simbox.io'>Simbox.io</Link>
          <a href="https://github.com/Simbox-io/mcms" target="_blank" rel="noopener noreferrer" className="ml-2 text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="inline-block w-4 h-4 align-text-bottom" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.09.682-.217.682-.482 0-.237-.009-.866-.014-1.7-2.782.602-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.532 1.03 1.532 1.03.891 1.529 2.341 1.088 2.914.833.091-.646.349-1.086.635-1.335-2.22-.25-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.251-.447-1.265.098-2.634 0 0 .84-.27 2.75 1.02A9.564 9.564 0 0112 7.07c.85.004 1.7.114 2.5.334 1.909-1.29 2.747-1.02 2.747-1.02.546 1.37.202 2.383.1 2.634.64.698 1.028 1.59 1.028 2.682 0 3.841-2.337 4.687-4.565 4.934.359.31.678.92.678 1.852 0 1.335-.012 2.415-.012 2.741 0 .267.18.576.688.479C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z"></path>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;