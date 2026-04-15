// 1. მოდელის ჩატვირთვა (მიუთითე პროექტის სახელი /29J/)
const fbx = useFBX('/29J/d25.FBX') as THREE.Group;

// 2. ტექსტურების ჩატვირთვა
const textures = useTexture({
    map: '/29J/textures/b4.jpg',
    mask: '/29J/textures/mask75.jpg',
    cord: '/29J/textures/shnur kapron.jpg',
});
