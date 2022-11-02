// ** MUI Imports
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import { Theme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

const FooterContent = () => {
  // ** Var
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  function loginWithKakao() {
    const CLIENT_ID = '214f882001474304a397de3fa79c9de0'
    const REDIRECT_URI = 'http://localhost:3002/kakaoLogin/oauthRedirect'

    // const REDIRECT_URI = `${process.env.REACT_APP_REDIRECT_URI}`
    // const CLIENT_ID = `${process.env.REACT_APP_KAKAO_KEY}`
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`

    // const test = window.location.href(KAKAO_AUTH_URL)
    // const test = window.location.replace(KAKAO_AUTH_URL)
    window.location.href = KAKAO_AUTH_URL

    // console.log('test', test)
    // console.log('test11', KAKAO_AUTH_URL)
  }
  
return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography sx={{ mr: 2 }}>
        {`© ${new Date().getFullYear()}, Made with2 `}
        <Box component='span' sx={{ color: 'error.main' }}>
          ❤️
          {/* <img onClick={() => loginWithKakao()} alt={'kakao-login'} style={{ borderRadius: '4px' }}></img> */}
          <img
            onClick={() => loginWithKakao()}
            alt={'kakao-login'}
            src='//k.kakaocdn.net/14/dn/btqCn0WEmI3/nijroPfbpCa4at5EIsjyf0/o.jpg'
            width='180'
          />
        </Box>
        {` by `}
        <Link target='_blank' href='https://pixinvent.com/'>
          Pixinvent
        </Link>
      </Typography>
      {hidden ? null : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', '& :not(:last-child)': { mr: 4 } }}>
          <Link target='_blank' href='https://themeforest.net/licenses/standard'>
            License
          </Link>
          <Link target='_blank' href='https://1.envato.market/pixinvent_portfolio'>
            More Themes
          </Link>
          <Link
            target='_blank'
            href='https://pixinvent.com/demo/materialize-mui-react-nextjs-admin-template/documentation'
          >
            Documentation
          </Link>
          <Link target='_blank' href='https://pixinvent.ticksy.com/'>
            Support
          </Link>
        </Box>
      )}
    </Box>
  )
}

export default FooterContent
