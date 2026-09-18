pipeline {
    agent any

    stages {
        stage('Install') {
            steps {
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test -- --passWithNoTests'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t order-processing-platform:latest .'
            }
        }

        stage('Deploy') {
            steps {
                withCredentials([
                    string(credentialsId: 'aws-access-key-id', variable: 'AWS_ACCESS_KEY_ID'),
                    string(credentialsId: 'aws-secret-access-key', variable: 'AWS_SECRET_ACCESS_KEY')
                ]) {
                    sh '''
                        docker rm -f order-processing-app || true

                        docker run -d \
                          --name order-processing-app \
                          -p 3000:3000 \
                          -e AWS_ACCESS_KEY_ID="$AWS_ACCESS_KEY_ID" \
                          -e AWS_SECRET_ACCESS_KEY="$AWS_SECRET_ACCESS_KEY" \
                          -e AWS_REGION="ap-south-1" \
                          order-processing-platform:latest
                    '''
                }
            }
        }
    }
}