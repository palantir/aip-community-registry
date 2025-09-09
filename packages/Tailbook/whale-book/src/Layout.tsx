import React from "react";
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children?: React.ReactNode;
}

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Whales', href: '/', current: true },
  { name: 'Report a Sighting', href: '/report', current: false },
]

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const updatedNavigation = navigation.map(item => ({
    ...item,
    current: item.href === location.pathname
  }));

  return (
    <>
      <div className="min-h-full">
        <div className="bg-teal-600 pb-32">
          <Disclosure as="nav" className="border-b border-teal-300/25 bg-teal-600 lg:border-none">
            <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
              <div className="relative flex h-16 items-center justify-between lg:border-b lg:border-teal-400/25">
                <div className="flex items-center px-2 lg:px-0">
                  <div className="shrink-0 p-2">
                    <img
                      alt="TailBook Logo"
                      src="https://i.imgur.com/m78Ut1Z.png"
                      className="block size-12 hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="hidden lg:ml-10 lg:block">
                    <div className="flex space-x-4">
                      {updatedNavigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          aria-current={item.current ? 'page' : undefined}
                          className={classNames(
                            item.current ? 'bg-teal-700 text-white' : 'text-white hover:bg-teal-500/75',
                            'rounded-md px-3 py-2 text-sm font-medium',
                          )}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex lg:hidden">
                  {/* Mobile menu button */}
                  <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-teal-600 p-2 text-teal-200 hover:bg-teal-500/75 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-teal-600">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    <Bars3Icon aria-hidden="true" className="block size-6 group-data-[open]:hidden" />
                    <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-[open]:block" />
                  </DisclosureButton>
                </div>
              </div>
            </div>

            <DisclosurePanel className="lg:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {updatedNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    aria-current={item.current ? 'page' : undefined}
                    className={classNames(
                      item.current ? 'bg-teal-700 text-white' : 'text-white hover:bg-teal-500/75',
                      'block rounded-md px-3 py-2 text-base font-medium',
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </DisclosurePanel>
          </Disclosure>
          <header className="py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold tracking-tight text-white">TailBook</h1>
            </div>
          </header>
        </div>

        <main className="-mt-32">
          <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
            <div className="rounded-lg bg-white px-5 py-6 shadow sm:px-6">{children}</div>
          </div>
        </main>
      </div>
    </>
  );
}

export default Layout;
