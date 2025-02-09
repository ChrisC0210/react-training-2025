// layout page
import React from 'react';
import { Link } from 'react-router-dom';
import { Outlet } from 'react-router-dom'

const Layout: React.FC = () => {
  return (
    <>
      <div className="bg-body-tertiary">
        <nav className="navbar navbar-expand-lg container">
          <div className="container-fluid">
            <a className="navbar-brand fw-bold" href="#">REACT TRAINING</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarText">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className='nav-link active' to="/react-training-2025">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className='nav-link' to="https://chrisc0210.github.io/ReactWeek1/">Week1</Link>
                </li>
                <li className="nav-item">
                  <Link className='nav-link' to="/react-training-2025/week2">Week2</Link>
                </li>
                <li className="nav-item">
                  <Link className='nav-link' to="/react-training-2025/week3">Week3</Link>
                </li>
              </ul>
              {/* <span className="navbar-text">
              LOGIN
            </span> */}
            </div>
          </div>
        </nav>
        {/* TITLE */}
        {/* <main>
        <section>
          <h1>Layout</h1>
        </section>
      </main> */}
      </div>
      <Outlet />
    </>
  );
}

export default Layout;