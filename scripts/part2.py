import numpy as np
import matplotlib.pyplot as plt
from matplotlib.colors import Normalize

print("Creating array...")
original_array = np.random.randint(0, 65536, size=(1000, 10000), dtype=np.uint16)
final_array = original_array.astype(np.float32).copy()

valid_mask = original_array > 0

log_data = np.zeros_like(final_array)
log_data[valid_mask] = 10 * np.log10(original_array[valid_mask])

transform_mask = valid_mask & (log_data < 13)
final_array[transform_mask] = 2 * log_data[transform_mask]

print(f"Array shape: {final_array.shape}")
print(f"Value range: [{final_array.min():.2f}, {final_array.max():.2f}]")
print(f"Cells transformed: {transform_mask.sum()} / {final_array.size}")

print("Creating visualization...")
fig, ax = plt.subplots(figsize=(15, 3))

norm = Normalize(vmin=np.percentile(final_array, 1), 
                 vmax=np.percentile(final_array, 99))

im = ax.imshow(final_array, cmap='viridis', aspect='auto', norm=norm)
ax.set_title('Transformed Raster Array (1000×10000)', fontsize=14)
ax.set_xlabel('Column Index')
ax.set_ylabel('Row Index')

cbar = plt.colorbar(im, ax=ax, label='Transformed Value')

plt.tight_layout()
plt.savefig('raster_output.png', dpi=150, bbox_inches='tight')
print("Image saved as 'raster_output.png'")

plt.show()
