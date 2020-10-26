cd frontend
npm run build
cd ..
mkdir NanoMailAdmin
cp -R backend NanoMailAdmin
cp -R frontend/build/* NanoMailAdmin
zip -r NanoMailAdmin.zip NanoMailAdmin/*
rm -r NanoMailAdmin