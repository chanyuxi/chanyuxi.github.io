import { styled } from 'styled-components'

import { mobile, tablet } from '@/utils/css'

const Contianer = styled.div`
    width: 100%;
    padding: 0 20%;

    ${tablet(`padding: 0 80px;`)}
    ${mobile(`padding: 0 20px;`)}
`

export default Contianer
