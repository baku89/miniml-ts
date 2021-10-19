import type {Config} from '@jest/types'

const config: Config.InitialOptions = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	passWithNoTests: true,
}

export default config
