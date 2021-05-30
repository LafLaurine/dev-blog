import React from 'react'
import { Grid, Row, Col } from 'react-flexbox-grid'
import Link from 'next/link'

const avatar = `https://avatars2.githubusercontent.com/u/30570842?s=460&u=9fcf4675ee5015af27ca8843cfee7e9a15528a18&v=4`

function Layout({ children, isHomepage, secondaryPage }) {
  const salut = "Remove this noise and describe me this image !"

  const containerProps = {
    ...isHomepage && { md: 12 },
    ...!isHomepage && { md: 8, mdOffset: 2 },
  }

  return (
    <>
      <div className="top-menu">
        <Row>
          <Col xs={10}>
            <ul>
              <li className="logo">
                <Link href="/" as="/">
                  <a href="https://github.com/LafLaurine" target="_blank">
                    <img src={avatar} />
                  </a>
                </Link>
              </li>
            </ul>
          </Col>
        </Row>
      </div>

      <Grid>
        <Row>
          <Col {...containerProps}>
            {!secondaryPage && (
              <div style={{ textAlign: 'center' }}>
                <h1 className="blog-title">
                  {salut}
                </h1>

                <p className="entry-description">
                  A development journey of my personal deep learning project, including denoising and an image descriptor
                </p>
              </div>
            )}

            {children}

            {secondaryPage && (
              <div className="bottom-mobile-nav">
                <Row>
                  <Col xs={6} />
                </Row>
              </div>
            )}
          </Col>
        </Row>
      </Grid>

      <footer>
        <div>Enjoy</div>
      </footer>
    </>
  )
}

export default Layout
