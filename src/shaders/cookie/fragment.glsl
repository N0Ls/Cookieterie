uniform sampler2D uTexture; 
uniform float uIndex;
uniform float uRatio;
varying vec2 vUv;
void main()
{
    float xOffset = (mod(uIndex, uRatio-1.0));
    float yOffset = floor(uIndex / (uRatio-1.0));
    vec2 newUv = vUv;
        newUv = vec2(vUv.y * (1.0/uRatio) + xOffset * (1.0/uRatio) , vUv.x * (1.0/uRatio) + yOffset * (1.0/uRatio));
    vec4 colorImage = texture2D(uTexture, newUv);
    vec3 color = vec3(1.0, 0.0, 0.0);
    gl_FragColor = colorImage;

}